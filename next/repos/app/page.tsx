'use client'; // client 编译
// 事件监听 、生命周期等

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { type Todo } from '@/app/types/todo';
import { json, text } from 'stream/consumers';

export default function Home() {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);


  const addTodo = async () => {
    if (!newTodo.trim()) return

    await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Text': 'application/json'
      },
      body: JSON.stringify({
        text: newTodo
      })
    })
    setNewTodo("")
    fetchTodos()

  }


  // const addTodo = async () => {
  //   // 1.判断输入的待办事项内容是否为空（去除首尾空格后），如果为空则直接返回，不执行后续操作
  //   if (!newTodo.trim()) return;
  //   // 2.向后端API发送POST请求添加新的待办事项
  //   await fetch('/api/todos', {
  //     method: 'POST', // 使用POST方法向服务器发送数据
  //     headers: {
  //       'Content-Type': 'application/json', // 设置请求头，告诉服务器发送的数据格式为JSON
  //     },
  //     body: JSON.stringify({ // 将JavaScript对象转换为JSON字符串格式
  //       text: newTodo, // 将用户输入的待办事项文本作为请求体发送
  //     })
  //   })
  //   setNewTodo("") // 清空输入框，将newTodo状态重置为空字符串
  //   fetchTodos() // 重新获取所有待办事项列表，以便在页面上显示最新的数据
  // }



  const fetchTodos = async () => {
    const response = await fetch('/api/todos');
    const data = await response.json();
    setTodos(data);
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    await fetch('/api/todos', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, completed }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <main className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add new todo..."
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <Button onClick={addTodo}>Add</Button>
          </div>
          <div className="space-y-2">
            {todos.map((todo: Todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => toggleTodo(todo.id, e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className={todo.completed ? 'line-through' : ''}>
                    {todo.text}
                  </span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
