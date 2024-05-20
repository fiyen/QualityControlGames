// CardsPage.js
import Card from './firstcard';
import './firstpage.css'; // 假设您已经将CSS转化为适用于React的格式
import AuthContext from './AuthContext';
import React, { useEffect, useContext } from 'react';

function FirstPage() {
  const { markVisited } = useContext(AuthContext);

  useEffect(() => {
    markVisited("FirstPage");
  }, [markVisited]);

  return (
    <div>
      <div style={{display: "flex", justifyContent: "center"}}>
        <h1>质量检验游戏</h1>
      </div>
      <br/><hr/><br/>
      <div className="container">
        <Card
          background="assets/page1-student.png"
          title="学生入口"
          actionText="开始游戏"
          to="/InforPage"
        >
          点击开始游戏进入游戏目录.
        </Card>
        <Card
          background="assets/page1-teacher.png"
          title="老师入口"
          actionText="查看结果"
          to="/LoginPage"
        >
          点击查看结果查看游戏结果和统计得分.
        </Card>
      </div>
      <br/><hr/><br/>
    </div>
    
  );
}

export default FirstPage;
