const GeniusFetcher = require('genius-lyrics-fetcher');
const config = require('../config');
const axios = require('axios');
const Genius = require("genius-lyrics");
const natural = require('natural');
const stopword = require('stopword');

exports.getAll = async (req, res) => {
  
    const lyricsArr = await fetchLyrics();
   
    // lyricsArr.forEach( lyr => {
    //     console.log(lyr.authorName)
    //     console.log(lyr.lyrics)});
   
    const output = "test";
    res.status(200).send(output);
  
}

const fetchLyrics = async () => {
   
//     const Client =  new Genius.Client(config.CLIENT_ACCESS_TOKEN);
//     const searches = await Client.songs.search("fade");

//    //TODO: refac to promise.all or sth to avoid mutable arr and temp obj
//    console.log(searches);
//    let songsLyrics = [];
//    let songWithLyrics;
//    searches.map( song => {
//        song
//         .lyrics()
//         .then(lyricResolved => {
//             songWithLyrics = {
//                 authorName: song.artist.name,
//                 authorId: song.artist.id,
//                 lyrics: lyricResolved
//             }
//             songsLyrics.push(songWithLyrics);
//         })
//         .catch(err => console.log(err));
//    })

const client = new GeniusFetcher.Client(config.CLIENT_ACCESS_TOKEN);
const result = await client.fetch("San Francisco Street", "Sun Rai");


const sanitizedLyrics = String(result
                            .lyrics)
                            .replace(/ *\[[^\]]*]/g, '')
                            .toLowerCase()
                            .replace(/[^a-zA-Z\s]+/g, '');

const sanitLexic = sanitizedLyrics;

const { WordTokenizer } = natural;
  const tokenizer = new WordTokenizer();
  const tokenizedReview = stopword.removeStopwords(tokenizer.tokenize(sanitLexic));
  console.log(tokenizedReview);

  const unique = [...new Set(tokenizedReview)];
  //console.log(unique);
  const wordCountMap = unique.map(currentUniqueWord => {
    return {
      word: currentUniqueWord,
      count: tokenizedReview.filter(el => el === currentUniqueWord).length
    }
  }).sort((a, b) => (a.count < b.count) ? 1 : -1);
  console.log(wordCountMap.slice(0,5));

  const { SentimentAnalyzer, PorterStemmer } = natural;
  const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
  const analysis = analyzer.getSentiment(tokenizedReview);
  console.log(analysis);


    // const firstSong = searches[1];
    // console.log("About the Song:\n", firstSong, "\n");
//     const artist = await Client.artists.get(456537);
// console.log("About the Artist:\n", artist, "\n");
  //  return songsLyrics;
}

