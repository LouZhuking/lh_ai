import {
  useEffect,
  useRef
} from 'react'

const AudioPlayer = ({ audioUrl, mimeType }) => {
  const audioPlayer = useRef(null)
  const audioSource = useRef(null);

  useEffect(() => {
    if (audioPlayer.current && audioSource.current) {
      // 安全地处理音频播放
      const playAudio = async () => {
        try {
          audioPlayer.current.pause();
          audioSource.current.src = audioUrl;
          audioPlayer.current.load();
          
          // 等待音频加载完成后再尝试播放
          audioPlayer.current.oncanplaythrough = async () => {
            try {
              await audioPlayer.current.play();
            } catch (playError) {
              // 忽略中断错误，这是预期的行为
              if (playError.name !== 'AbortError') {
                console.warn('播放失败:', playError);
              }
            }
          };
        } catch (error) {
          console.warn('音频处理失败:', error);
        }
      };

      playAudio();

      // 清理函数
      return () => {
        if (audioPlayer.current) {
          audioPlayer.current.pause();
          audioPlayer.current.oncanplaythrough = null;
        }
      };
    }
  }, [audioUrl])
  return (
    <div className="flex relative z-10 my-4 w-full">
      <audio
        ref={audioPlayer}
        controls
        className="w-full h-14 rounded-lg bg-white 
              shadow-xl shadow-black/5 ring-1 ring-slate-700/10"
      >
        {/* 浏览器兼容声音的类型不一样 多个source */}
        <source ref={audioSource} type={mimeType} />
      </audio>
    </div>
  )
}

export default AudioPlayer