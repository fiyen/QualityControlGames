import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // 使用useNavigate替代useHistory
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import AuthContext from './AuthContext'


function LoginPage() {

  const { markVisited } = useContext(AuthContext);

  useEffect(() => {
    markVisited("LoginPage");
  }, [markVisited]);

  const [secret, setSecret] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate(); // 获取navigate函数

  // 当点击按钮时调用此函数
  const handleSubmit = () => {
    if (secret === import.meta.env.VITE_LoginSecret) {
      // 如果组名不为空，则通过navigate跳转，并附带组名参数
      navigate(`/StatsPage`);
    } else {
        setShowAlert(true); // 显示警告
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      {showAlert && (
        <Alert variant="destructive">
          <AlertTitle>Not Matched!</AlertTitle>
          <AlertDescription>
            密码错误，请重新输入.
          </AlertDescription>
        </Alert>
      )}
      <Label htmlFor='secret'>请输入密码</Label>
      <hr/>
      <Input 
        type="password" 
        placeholder="输入密码" 
        id='secret'
        value={secret} 
        onChange={e => setSecret(e.target.value)} 
      />
      <Button 
        type='button'  
        variant='outline' 
        onClick={handleSubmit} 
      >
        提交登录
      </Button>
    </div>
  );
}

export default LoginPage;
