const express = require('express');

const lyricsService = require('../services/LyricsService');

const router = express.Router();

router
    .route('/api/search')
    .get(lyricsService.getSearchResults)

router
    .route('/api/analysis')
    .get(lyricsService.getAnalysis)

module.exports = router;