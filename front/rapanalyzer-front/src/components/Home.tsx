import React,{FunctionComponent, useState, useEffect} from 'react';
import './Home.modules.scss';
import './Analysis.modules.scss';
import { AutoComplete } from 'antd';
import axios, {AxiosResponse, AxiosRequestConfig} from 'axios';
import BarChart from './BarChart/BarChart';
import SentimentFace from './SentimentFace/SentimentFace';
import DonutChart from './DonutChart/DonutChart';
export interface HomeProps {
    
}
interface AnalysisData  {
  title:string;
  author:string;
  sentiment:number;
  topFiveWords: Array<topWord>;
  lyrics: string;
}
interface topWord {
  word:string;
  count:number;
}

const Home: FunctionComponent<HomeProps> = () => {
    const [value, setValue] = useState('');
    const [options, setOptions] = useState<{ value: string }[]>([]);
    const [optionsFullData, setOptionsFullData] = useState([]);
    const [chosen, setChosen] = useState('');
    const [analysis, setAnalysis] = useState<AnalysisData>({  
      title: "",
      author: "",
      sentiment: 0,
      topFiveWords: [],
      lyrics: ""});

    const fetchSearchResults = async (searchParam:string ): Promise<any> => {
      console.log(searchParam);
      if(!searchParam || searchParam.length < 2)
        return;
      const body:any = {
        query: searchParam
      }
      console.log(body);
      axios.get("/api/search",{params: body})
        .then((resp: AxiosResponse) => {
          console.log(resp.data);
          setOptionsFullData(resp.data);
          return resp.data;
        })
        .catch(err => console.log(err));
    }

    const fetchAnalysis = async (): Promise<any> => {
     
      // if(!searchParam || searchParam.length < 2)
      //   return;
      const [title, author] = chosen.split(" by ");
      console.log(title);
      console.log(author);
      const body:any = {
        title: title,
        author: author
      }
      // console.log(body);
      axios.get("/api/analysis",{params: body})
        .then((resp: AxiosResponse) => {
          console.log(resp.data);
          setAnalysis(resp.data);
          return resp.data;
        })
        .catch(err => console.log(err));
    }

    

    const onSearch = async (searchText: string) => {
        // setOptions(
        //   !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)],
        // ); 
         await fetchSearchResults(value);
        //  console.log(results);
        //  const arr = 
        setOptions(
        
          !value  ? [] : optionsFullData.map((song:any) => {return {value: song.title +" by " + song.artist.name}}),
        );
      };

      const onSelect = (data: string) => {
        // console.log('onSelect', data);
        setChosen(data);
      };
      const onChange = (data: string) => {
        setValue(data);
      };
    return ( 
        <div className="main-bg">

       
        <main className="mainbox">
            <h1 className="mainbox__heading">Analyze a song!</h1>
            <h3 className="mainbox__heading mainbox__heading--small">
                Pick a song from Genius.com to discover the unknown
            </h3>
            <AutoComplete
        value={value}
        options={options}
        style={{ width: 300 }}
        onSelect={onSelect}
        onSearch={onSearch}
        onChange={onChange}
        placeholder="Find a song..."
      />

      {chosen ? 
      <>
        <div className="mainbox__chosen">
        {chosen}
        </div>
        <button className="" onClick={fetchAnalysis}></button>
      </>
      : null
      }
      {analysis && analysis.topFiveWords.length === 5 ?
        <div className="analysis-box">
          <p className="analysis-box__pre">Song title:</p>
          <h5 className="analysis-box__title">{analysis.title}</h5>
          <p className="analysis-box__pre">Author:</p>
          <h5 className="analysis-box__author">{analysis.author}</h5>

          <div className="sentiment-box"> {analysis.sentiment}</div>
          <div className="topwords">
            <ul className="topwords__list">
              {analysis.topFiveWords.map(wordObj => <div>
                
              </div> )}
            </ul>
          </div>
          <BarChart topWordsData={analysis.topFiveWords}/>
          <SentimentFace sentiment={analysis.sentiment}/>
          <p>{analysis.lyrics.split(" ").length}</p>
          <p>{analysis.lyrics}</p>
          <DonutChart topWordsData={analysis.topFiveWords} allWords={analysis.lyrics.split(" ").length}/>
         
        </div>
        : null
      }
      
        </main>
        </div>
     );
}
 
export default Home;