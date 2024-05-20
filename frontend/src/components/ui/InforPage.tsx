import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // 使用useNavigate替代useHistory
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import AuthContext from './AuthContext';

function InforPage() {
  const { markVisited } = useContext(AuthContext);

  useEffect(() => {
    markVisited("InforPage");
  }, [markVisited]);

  const [groupName, setGroupName] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate(); // 获取navigate函数

  // 当点击按钮时调用此函数
  const handleSubmit = () => {
    if (groupName) {
      // 如果组名不为空，则通过navigate跳转，并附带组名参数
      navigate(`/GamePage`, { state: { groupName } });
    } else {
        setShowAlert(true); // 显示警告
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      {showAlert && (
        <Alert variant="destructive">
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            请输入一个组名再进行提交.
          </AlertDescription>
        </Alert>
      )}
      <Label htmlFor='group-name'>请输入组名，首次输入即注册，同组登录务必保持组名不变</Label>
      <hr/>
      <Input 
        type="text" 
        placeholder="输入组名" 
        id='group-name'
        value={groupName} 
        onChange={e => setGroupName(e.target.value)} 
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

export default InforPage;
