const express = require('express');

const lyricsService = require('../services/LyricsService');

const router = express.Router();

router
    .route('/')
    .get(lyricsService.getAll)

module.exports = router;