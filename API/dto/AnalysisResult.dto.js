class AnalysisResult {
  constructor(title, author, sentiment, topFiveWords, lyrics) {
    this.title = title;
    this.author = author;
    this.sentiment = sentiment;
    this.topFiveWords = topFiveWords;
    this.lyrics = lyrics;
  }
}

module.exports = { AnalysisResult };
