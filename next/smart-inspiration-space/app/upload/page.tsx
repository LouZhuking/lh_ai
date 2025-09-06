"use client"

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo
} from 'react'
import {
  HashWorkerIn,
  type HashWorkerOut
} from '../hash.worker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { Upload, Pause, Play, RotateCcw, CheckCircle } from 'lucide-react'

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB一片
const MAX_CONCURRENCY = 4 // 最大并发数

type InitResp = {
  complete: boolean;
  uploaded: number[];
}

const UploadPage = () => {
  const [hash, setHash] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string>("")
  const [progress, setProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)

  const totalChunks = useMemo(() => file ? Math.ceil(file.size / CHUNK_SIZE) : 0, [file])

  // 可变对象refs
  const workerRef = useRef<Worker | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const pausedRef = useRef<boolean>(false)

  const { toast } = useToast()

  useEffect(() => {
    const worker = new Worker(new URL("../hash.worker.ts", import.meta.url));
    workerRef.current = worker;
    worker.onmessage = (e: MessageEvent<HashWorkerOut>) => {
      const msg = e.data;
      if (msg.type === 'PROGRESS') {
        setStatus(`计算哈希中 ${(msg.progress * 100).toFixed(2)}%`)
      }
      if (msg.type == 'DONE') {
        setHash(msg.hash)
        setStatus(`哈希值: ${msg.hash.substring(0, 16)}...`)
      }
    }

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    }
  }, [])

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    setProgress(0)
    setHash('')
    setStatus("计算文件哈希中...");
    workerRef.current?.postMessage({
      type: 'HASH',
      file: f,
      chunkSize: CHUNK_SIZE
    } as HashWorkerIn)
  }, [])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      handleFile(f);
    }
  }

  // 初始化上传
  const initUpload = async (): Promise<InitResp> => {
    const res = await fetch("/api/upload/init", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fileHash: hash,
        fileName: file!.name,
        fileSize: file!.size,
        chunkSize: CHUNK_SIZE,
        totalChunks
      })
    })

    if (!res.ok) {
      throw new Error('初始化上传失败')
    }

    return res.json() as Promise<InitResp>
  }

  const pause = () => {
    pausedRef.current = true
    setIsPaused(true)
    abortRef.current?.abort()
    setStatus("上传已暂停")
  }

  const resume = async () => {
    if (!file || !hash) return;
    setIsPaused(false)
    pausedRef.current = false
    setStatus("继续上传...");
    await startUpload();
  }

  const reset = () => {
    setFile(null)
    setHash('')
    setProgress(0)
    setStatus('')
    setIsUploading(false)
    setIsPaused(false)
    pausedRef.current = false
    abortRef.current?.abort()
  }

  const uploadChunk = async (index: number, signal: AbortSignal) => {
    const start = index * CHUNK_SIZE;
    const end = Math.min(file!.size, start + CHUNK_SIZE)
    const blob = file!.slice(start, end);

    const res = await fetch("/api/upload/chunk", {
      method: "PUT",
      headers: {
        "x-file-hash": hash,
        "x-chunk-index": String(index)
      },
      body: blob,
      signal
    })

    if (!res.ok) throw new Error(`分片${index}上传失败`)
    return res.json();
  }

  const mergeAll = async () => {
    const res = await fetch("/api/upload/merge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fileHash: hash,
        fileName: file!.name
      })
    })

    if (!res.ok) throw new Error('合并文件失败')
    return res.json()
  }

  const startUpload = async () => {
    if (!file || !hash) {
      toast({
        title: "上传失败",
        description: "请先选择文件",
        variant: "destructive"
      })
      return;
    }

    setIsUploading(true)
    setStatus("初始化上传....")
    abortRef.current = new AbortController();
    pausedRef.current = false;

    try {
      const init = await initUpload()

      if (init.complete) {
        setProgress(100);
        setStatus("文件已存在，秒传完成");
        toast({
          title: "上传完成",
          description: "文件秒传成功！"
        })
        setIsUploading(false)
        return;
      }

      // 不可重复的切片index 存储
      const uploaded = new Set<number>(init.uploaded ?? [])
      let done = uploaded.size;
      setProgress(Math.floor((done / totalChunks) * 100))

      // 并发限流队列
      const queue: number[] = [];
      for (let i = 0; i < totalChunks; i++) {
        if (!uploaded.has(i)) {
          queue.push(i);
        }
      }

      if (queue.length === 0) {
        setStatus("所有分片已上传，开始合并...")
        const result = await mergeAll()
        setProgress(100)
        setStatus(result?.ok ? "上传完成" : "合并失败")
        setIsUploading(false)
        if (result?.ok) {
          toast({
            title: "上传完成",
            description: "文件上传成功！"
          })
        }
        return
      }

      // upload workers
      const workers: Promise<void>[] = [];

      const next = async () => {
        if (pausedRef.current) return; // 暂停
        const idx = queue.shift();
        if (idx === undefined) return;
        try {
          await uploadChunk(idx, abortRef.current!.signal);
          done++;
          setProgress(Math.floor((done / totalChunks) * 100))
        } finally {
          if (queue.length && !pausedRef.current) await next()
        }
      }

      // 启动worker
      for (let c = 0; c < Math.min(MAX_CONCURRENCY, queue.length); c++) {
        workers.push(next())
      }

      setStatus("分片上传中...")
      await Promise.all(workers)

      if (pausedRef.current) {
        setStatus("已暂停")
        setIsUploading(false)
        return;
      }

      setStatus("合并分片....")
      const result = await mergeAll()
      setProgress(100)
      setStatus(result?.ok ? "上传完成" : "合并失败")

      if (result?.ok) {
        toast({
          title: "上传完成",
          description: "文件上传成功！"
        })
      } else {
        toast({
          title: "上传失败",
          description: "文件合并失败",
          variant: "destructive"
        })
      }

    } catch (err: any) {
      if (err?.name === "AbortError") {
        setStatus("已暂停")
      } else {
        console.error(err);
        setStatus(err?.message || "上传错误")
        toast({
          title: "上传失败",
          description: err?.message || "上传过程中出现错误",
          variant: "destructive"
        })
      }
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='mx-auto max-w-2xl space-y-6'>
        <div className="text-center">
          <h1 className='text-3xl font-bold mb-2'>大文件上传</h1>
          <p className="text-muted-foreground">
            支持分片上传、断点续传、秒传功能
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              选择文件
            </CardTitle>
          </CardHeader>
          <CardContent>
            <label className='block'>
              <span className='text-sm text-muted-foreground mb-2 block'>选择要上传的文件</span>
              <input
                type='file'
                className='block w-full cursor-pointer rounded-lg border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium'
                onChange={onFileChange}
                disabled={isUploading}
              />
            </label>
          </CardContent>
        </Card>

        {file && (
          <Card>
            <CardHeader>
              <CardTitle>上传详情</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className='space-y-2 text-sm'>
                <div><strong>文件名:</strong> {file.name}</div>
                <div><strong>文件大小:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                <div><strong>分片大小:</strong> {CHUNK_SIZE / (1024 * 1024)} MB</div>
                <div><strong>分片总数:</strong> {totalChunks}</div>
                {hash && (
                  <div><strong>文件哈希:</strong> {hash.substring(0, 32)}...</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">上传进度</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>

              <div className='text-sm text-muted-foreground'>{status}</div>

              <div className="flex gap-2">
                {!isUploading && !isPaused && (
                  <Button
                    onClick={startUpload}
                    disabled={!hash || !file}
                    className="flex-1"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    开始上传
                  </Button>
                )}

                {isUploading && (
                  <Button
                    onClick={pause}
                    variant="outline"
                    className="flex-1"
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    暂停
                  </Button>
                )}

                {isPaused && (
                  <Button
                    onClick={resume}
                    className="flex-1"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    继续
                  </Button>
                )}

                <Button
                  onClick={reset}
                  variant="outline"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  重置
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default UploadPage
