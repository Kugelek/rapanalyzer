import React,{FunctionComponent, useState, useEffect} from 'react';
import './Home.modules.scss';
import './Analysis.modules.scss';
import { AutoComplete } from 'antd';
import axios, {AxiosResponse, AxiosRequestConfig} from 'axios';
import BarChart from './BarChart/BarChart';
import SentimentFace from './SentimentFace/SentimentFace';
import DonutChart from './DonutChart/DonutChart';
import PropagateLoader from './PropagateLoader/PropagateLoader';
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

    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);

    const fetchSearchResults = async (searchParam:string ): Promise<any> => {
      console.log(searchParam);
      if(!searchParam || searchParam.length < 2)
        return;
      setLoadingSearch(true);
      const body:any = {
        query: searchParam
      }
      console.log(body);
      axios.get("/api/search",{params: body})
        .then((resp: AxiosResponse) => {
          console.log(resp.data);
          setOptionsFullData(resp.data);
          setLoadingSearch(false);
          return resp.data;
        })
        .catch(err => console.log(err));
    }

    const fetchAnalysis = async (): Promise<any> => {
     
     setLoadingAnalysis(true);
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
          setLoadingAnalysis(false);
          return resp.data;
        })
        .catch(err => console.log(err));
    }

    

    const onSearch = async (searchText: string) => {
        
         await fetchSearchResults(value);
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
      {loadingSearch ?  <PropagateLoader/> : null}

      {chosen ? 
      <>
      <p className="picked">Picked song:</p>
        <div className="mainbox__chosen">
        
        <p className="mainbox__chosen-title">{chosen}</p>
        <button className="mainbox__submit" onClick={fetchAnalysis}>Analyze</button>
        </div>
        
      </>
      : null
      }
      {loadingAnalysis ?  <PropagateLoader/> : null}

      {analysis && analysis.topFiveWords.length === 5 ?
        <div className="analysis-box">
          <div className="analysis-box__intro">
            <div className="analysis-box__left">
            <p className="analysis-box__pre">Song title:</p>
            <h5 className="analysis-box__title">{analysis.title}</h5>
            <p className="analysis-box__pre">Author:</p>
            <h5 className="analysis-box__author">{analysis.author}</h5>
            <p className="analysis-box__pre">Words used:</p>
            <h5 className="analysis-box__author">{analysis.lyrics.split(" ").length}</h5>
            </div>
            <SentimentFace sentiment={analysis.sentiment}/>
          </div>
      
          <h3 className="barchart__heading">Top 5 most used words</h3>
          <BarChart topWordsData={analysis.topFiveWords}/>

          <h3 className="donutchart__heading">Percentage of most used words in lyrics</h3>
          <DonutChart topWordsData={analysis.topFiveWords} allWords={analysis.lyrics.split(" ").length}/>

          <h3 className="lyrics__heading">Analyzed concatenated lyrics</h3>
          <p>{analysis.lyrics}</p>
        
        </div>
        : null
      }
      
        </main>
        </div>
     );
}
 
export default Home;