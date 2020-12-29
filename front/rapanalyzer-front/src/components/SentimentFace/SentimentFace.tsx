import React,{FunctionComponent} from 'react';
import {FrownOutlined, MehOutlined, SmileOutlined}  from "@ant-design/icons";
import 'antd/dist/antd.css'; 
import "./SentimentFace.modules.scss";
interface SentimentFaceProps{
    sentiment: number;
}
const SentimentFace: FunctionComponent<SentimentFaceProps> = (props) => {

    const getFaceIcon = () => {
        if(props.sentiment > 0.1) return <SmileOutlined className="icon icon--happy "/>;
        if(props.sentiment < -0.1) return <FrownOutlined className="icon icon--sad "/>;
        return <MehOutlined className="icon icon--neutral "/>;
    }

    return(
        <div>
        
            <p> {getFaceIcon()}</p>
        </div>
    );
}

export default SentimentFace;