// src/config/ML.config.js
import axios from 'axios';

const ML_BASE_URL = `${process.env.RUNPOD}`;

const mlAPI = axios.create({
  baseURL: ML_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 150000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

export default mlAPI;

