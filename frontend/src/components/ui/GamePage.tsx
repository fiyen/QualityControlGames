// CardsPage.js
import Card from './GameCard';
import './gamepage.css'; // 假设您已经将CSS转化为适用于React的格式
import { useLocation } from 'react-router-dom';
import AuthContext from './AuthContext';
import React, { useEffect, useContext } from 'react';

function GamePage() {
    const { markVisited } = useContext(AuthContext);

    useEffect(() => {
      markVisited("GamePage");
    }, [markVisited]);

    const locate = useLocation();
    const { groupName } = locate.state || {};

    const info_luosiding  = `AQL: ${import.meta.env.VITE_AQL_luosiding}
                            | 检验水平: ${import.meta.env.VITE_CL_luosiding} 
                            | ${import.meta.env.VITE_SWAY_luosiding}`
    const info_toycar  = `AQL: ${import.meta.env.VITE_AQL_toycar}
                            | 检验水平: ${import.meta.env.VITE_CL_toycar} 
                            | ${import.meta.env.VITE_SWAY_toycar}`
    const info_phone  = `AQL: ${import.meta.env.VITE_AQL_phone}
                            | 检验水平: ${import.meta.env.VITE_CL_phone} 
                            | ${import.meta.env.VITE_SWAY_phone}`
    return (
        <div>
        <div style={{display: "flex", justifyContent: "center"}}>
            <h1>组名：{groupName}</h1>
        </div>
        <br/><hr/><br/>
        <div className="cards">
            <Card
                background='assets/game2-toycar.png'
                prodNum={`#${import.meta.env.VITE_N_toycar}`}
                title="玩具汽车"
                description="某玩具汽车正在完成生产成品交付，有20批货需要交验，请你进行质量检验，并判断20批中哪些批次可以被接收，哪些批次应该被拒收。"
                properties={info_toycar}
                to="/ProdPage"
                groupName={groupName}
            >
            </Card>
            <Card
                background='assets/game1-luosiding.png'
                prodNum={`#${import.meta.env.VITE_N_luosiding}`}
                title="螺丝钉"
                description="某螺丝钉产品需要进行成品验收，你需要检验20批这样的螺丝钉交验批，记录下每批螺丝钉的情况，并推断该系列产品的质量是否稳定。"
                properties={info_luosiding}
                to="/ProdPage"
                groupName={groupName}
            >
            </Card>
            <Card
                background='assets/game3-phone.png'
                prodNum={`#${import.meta.env.VITE_N_phone}`}
                title="手机屏幕"
                description="某公司需要引入一批手机屏幕，每批次有400个屏幕，一共有20个交验批需要进行检验，由于是首次引入，公司为了评估检验成本是否合理，分别对一次抽样和二次抽样都进行试检验，最后通过结果确定后续采用何种方式进行检验。请分别用一次检验和二次检验进行检验，并给出后续使用何种检验方式的建议。"
                properties={info_phone}
                to="/ProdPage"
                groupName={groupName}
            >
            </Card>
        </div>
        <br/><hr/><br/>
        </div>
        
    );
}

export default GamePage;
