const GeniusFetcher = require("genius-lyrics-fetcher");
const config = require("../config");
const axios = require("axios");
const Genius = require("genius-lyrics");
const natural = require("natural");
const stopword = require("stopword");
const { AnalysisResult } = require("../dto/AnalysisResult.dto");

exports.getAnalysis = async (req, res) => {
  console.log("x" + req.query.title + req.query.author + "y");

  const lyricsArr = await fetchLyrics(req.query.title, req.query.author);
  res.status(200).json(lyricsArr);
};

exports.getSearchResults = async (req, res) => {
  const Client = new Genius.Client(config.CLIENT_ACCESS_TOKEN);
  console.log(req.query.query);
  const searches = await Client.songs.search(req.query.query);
  console.log(searches);
  res.status(200).send(searches);
};

const sanitizeLyrics = (lyrics) => {
  if (!lyrics) return null;

  return String(lyrics)
    .replace(/ *\[[^\]]*]/g, "")
    .toLowerCase()
    .replace(/[^a-zA-Z\s]+/g, "");
};

const fetchLyrics = async (title, author) => {
  const client = new GeniusFetcher.Client(config.CLIENT_ACCESS_TOKEN);

  const result = await client.fetch(title, author);

  const sanitizedLexic = sanitizeLyrics(result.lyrics);

  const { WordTokenizer } = natural;
  const tokenizer = new WordTokenizer();
  const tokenizedReview = stopword.removeStopwords(
    tokenizer.tokenize(sanitizedLexic)
  );
  console.log(tokenizedReview);

  const topWords = getMostCommonWords(tokenizedReview);
  const analysis = getSentimentAnalysis(tokenizedReview);

  return new AnalysisResult(title, author, analysis, topWords, sanitizedLexic);
};

const getMostCommonWords = (words, topWordsCount = 5) => {
  if (!words) return null;

  const uniqueWords = [...new Set(words)];

  return uniqueWords
    .map((currentWord) => {
      return {
        word: currentWord,
        count: words.filter((otherWord) => otherWord === currentWord).length,
      };
    })
    .sort((a, b) => (a.count < b.count ? 1 : -1))
    .slice(0, topWordsCount);
};

const getSentimentAnalysis = (words) => {
  if (!words) return null;

  const { SentimentAnalyzer, PorterStemmer } = natural;
  const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");
  return analyzer.getSentiment(words);
};
