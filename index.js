import React from "react";
import { Card, Progress, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface RiskCardProps {
  title: string;
  value: number;
}

const RiskCard: React.FC<RiskCardProps> = ({
  title = "risk cata",
  value = 100,
}) => {
  // Determine text and color based on value
  const getColor = () => {
    if (value < 50) return "#52c41a"; // green
    if (value < 75) return "#faad14"; // orange
    return "#ff4d4f"; // red
  };

  return (
    <Card
      style={{
        width: 260,
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        background: "#fff",
      }}
      bodyStyle={{ padding: "16px 20px" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text strong>{title}</Text>
        <ArrowRightOutlined style={{ color: "#999", fontSize: 16 }} />
      </div>

      {/* Risk Score */}
      <div style={{ textAlign: "center" }}>
        <Text strong style={{ fontSize: 32, color: getColor() }}>
          {value}
        </Text>
      </div>

      {/* Three-color Progress Bar */}
      <Progress
        percent={value}
        showInfo={false}
        strokeColor={{
          "0%": "#ff4d4f",
          "50%": "#faad14",
          "100%": "#52c41a",
        }}
        trailColor="#f5f5f5"
        style={{ marginTop: 8 }}
      />

      {/* Labels below progress bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          marginTop: 4,
          color: "#888",
        }}
      >
        <span>0–33%</span>
        <span>34–66%</span>
        <span>67–100%</span>
      </div>
    </Card>
  );
};

export default RiskCard;



import React, { useState, useCallback } from 'react';
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  Card,
  CircularProgress,
} from '@mui/material';

// --- API Helper Functions ---

const apiKey = ""; // API key is provided automatically by the environment
const GEMINI_FLASH_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
const GEMINI_TTS_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

// 1. Exponential Backoff Fetch
const fetchWithExponentialBackoff = async (url, options, maxRetries = 5) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status === 429 && i < maxRetries - 1) { // Rate limit
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw new Error(`API call failed with status: ${response.status}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
};

// 2. TTS Audio Conversion Helpers
const base64ToArrayBuffer = (base64) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const pcmToWav = (pcm16, sampleRate) => {
  const buffer = new ArrayBuffer(44 + pcm16.length * 2);
  const view = new DataView(buffer);
  
  // PCM format specifications
  const channels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);

  /* RIFF identifier */
  view.setUint32(0, 0x52494646, false); // "RIFF"
  /* file length */
  view.setUint32(4, 36 + pcm16.length * 2, true);
  /* RIFF type */
  view.setUint32(8, 0x57415645, false); // "WAVE"
  /* format chunk identifier */
  view.setUint32(12, 0x666d7420, false); // "fmt "
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true); // PCM
  /* channel count */
  view.setUint16(22, channels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, byteRate, true);
  /* block align (channels * bits per sample / 8) */
  view.setUint16(32, blockAlign, true);
  /* bits per sample */
  view.setUint16(34, bitsPerSample, true);
  /* data chunk identifier */
  view.setUint32(36, 0x64617461, false); // "data"
  /* data chunk length */
  view.setUint32(40, pcm16.length * 2, true);

  // Write the PCM data
  let offset = 44;
  for (let i = 0; i < pcm16.length; i++, offset += 2) {
    view.setInt16(offset, pcm16[i], true);
  }

  return new Blob([view], { type: 'audio/wav' });
};


// --- Custom Gauge Component (SVG based on the image) ---

const CustomRiskGauge = ({ score, plantName, plantCode, tag1, tag2, onGenerateStrategy, onGenerateTts, ttsLoading }) => {
  const radius = 50;
  const circumference = radius * 2 * Math.PI;
  // Score 91 out of 100 -> arc should cover 91% of the semi-circle's 50% circumference
  // Max visible stroke is half the circle (50%)
  const maxSemiCircleCoverage = circumference / 2;
  const strokeDashoffset = maxSemiCircleCoverage - (score / 100) * maxSemiCircleCoverage;
  const strokeColor = score >= 80 ? '#ef4444' : score >= 50 ? '#f59e0b' : '#10b981'; // Red, Amber, Green

  // SVG viewBox and dimensions setup
  const svgSize = 150;
  const center = svgSize / 2;
  const strokeWidth = 10;

  return (
    <Card className="p-4 shadow-xl rounded-xl w-72 h-72 flex flex-col justify-between" elevation={3}>
      {/* Header and Tags */}
      <Box className="flex justify-between items-start mb-2">
        <Box>
          <Typography variant="h6" className="font-bold text-gray-800">{plantName}</Typography>
          <Typography variant="caption" className="text-gray-500">{plantCode}</Typography>
        </Box>
        <Box className="space-y-1">
          <div className="text-white text-xs font-semibold px-2 py-0.5 rounded-full bg-red-600 shadow-md">
            {tag1}
          </div>
          <div className="text-white text-xs font-semibold px-2 py-0.5 rounded-full bg-green-600 shadow-md">
            {tag2}
          </div>
        </Box>
      </Box>

      {/* Gauge Visualization */}
      <Box className="flex justify-center items-center relative flex-grow">
        <svg
          width={svgSize}
          height={svgSize / 1.5} // Adjust height to make it a semi-circle view
          viewBox={`0 0 ${svgSize} ${svgSize / 2.5}`}
          className="-translate-y-4" // Move up to center the semi-circle vertically
          style={{ transformOrigin: '50% 100%' }}
        >
          {/* Background Arc (The full semi-circle) */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Foreground Arc (The score) */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={maxSemiCircleCoverage}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />

        </svg>

        {/* Center Score Text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-3">
          <Typography variant="h4" className="font-extrabold text-red-600">
            {score}
          </Typography>
        </div>

      </Box>

      {/* Footer Text and Actions */}
      <Box className="flex flex-col items-center -mt-8 pt-4 space-y-2">
        <Typography variant="body2" className="text-gray-500">
          Risk Score
        </Typography>
        <div className="flex space-x-2">
          {/* TTS Summary Button */}
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={onGenerateTts}
            disabled={ttsLoading}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {ttsLoading ? <CircularProgress size={20} /> : 'TTS Summary 🔈'}
          </Button>
          {/* Generate Strategy Button */}
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={onGenerateStrategy}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {'Generate Strategy ✨'}
          </Button>
        </div>
      </Box>
    </Card>
  );
};


// --- Main Application Component ---

export default function App() {
  const [selectedTab, setSelectedTab] = useState(3);
  const [riskType, setRiskType] = useState('Supplier');
  const [riskCategory, setRiskCategory] = useState('High');

  // LLM State
  const [strategyLoading, setStrategyLoading] = useState(false);
  const [riskStrategy, setRiskStrategy] = useState(null);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // --- Gemini API Call for Risk Strategy (Text Generation with Grounding) ---
  const generateRiskStrategy = useCallback(async () => {
    setStrategyLoading(true);
    setRiskStrategy(null);

    const plantName = "Heilbronn";
    const score = 91;

    const systemPrompt = "Act as a world-class supply chain risk management consultant. Generate a single, concise paragraph with 3 specific, actionable bullet points outlining an immediate mitigation strategy for the following high-risk scenario. The response must be structured in Markdown format (use ** for bolding).";
    
    const userQuery = `Develop a mitigation strategy for a plant named ${plantName} with a Risk Score of ${score}, where the primary risk is categorised as '${riskType}' and the severity is '${riskCategory}'. The plant is tagged as a 'Food' supplier.`;
    
    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      tools: [{ "google_search": {} }], // Enable search grounding for up-to-date data
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    try {
      const response = await fetchWithExponentialBackoff(GEMINI_FLASH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate strategy. Please try again.";
      setRiskStrategy(text);
    } catch (error) {
      console.error("Error generating risk strategy:", error);
      setRiskStrategy("Failed to generate strategy due to an API error.");
    } finally {
      setStrategyLoading(false);
    }
  }, [riskType, riskCategory]);


  // --- Gemini API Call for TTS Summary (Audio Generation) ---
  const generateTtsSummary = useCallback(async () => {
    setTtsLoading(true);
    setAudioUrl(null);
    
    // Example text to speak
    const speechText = `The Heilbronn plant currently has a critical risk score of 91. The primary risk type is ${riskType}, and the current risk category is ${riskCategory}. Immediate attention is required to secure the supply chain for this location.`;

    const payload = {
      contents: [{ parts: [{ text: speechText }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            // Using the 'Charon' voice (Informative)
            prebuiltVoiceConfig: { voiceName: "Charon" }
          }
        }
      },
      model: "gemini-2.5-flash-preview-tts"
    };

    try {
      const response = await fetchWithExponentialBackoff(GEMINI_TTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType;

      if (audioData && mimeType && mimeType.startsWith("audio/")) {
        // Extract sample rate from the mimeType string
        const sampleRateMatch = mimeType.match(/rate=(\d+)/);
        const sampleRate = sampleRateMatch ? parseInt(sampleRateMatch[1], 10) : 16000; // Default to 16kHz
        
        const pcmData = base64ToArrayBuffer(audioData);
        const pcm16 = new Int16Array(pcmData);
        
        const wavBlob = pcmToWav(pcm16, sampleRate);
        const url = URL.createObjectURL(wavBlob);
        setAudioUrl(url);

        // Auto-play the audio
        const audio = new Audio(url);
        audio.play().catch(e => console.log("Audio play failed, user interaction may be required.", e));

      } else {
        console.error("TTS response missing audio data.");
      }

    } catch (error) {
      console.error("Error generating TTS summary:", error);
    } finally {
      setTtsLoading(false);
    }
  }, [riskType, riskCategory]);


  return (
    // Main Container: Occupies 90% of the screen width and is centered
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex justify-center">
      <Box className="w-full max-w-7xl lg:w-[90%] bg-white rounded-2xl shadow-2xl p-6 sm:p-8">

        {/* 1. Main Tabs */}
        {/* Adjusted AppBar: Added padding to simulate the 20vh requirement for the header area */}
        <AppBar position="static" color="transparent" elevation={0} className="pb-4">
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="main navigation tabs"
            sx={{
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTabs-flexContainer': { alignItems: 'flex-end' }
            }}
          >
            {['Business Group', 'Business Unit', 'Country', 'Plant'].map((label, index) => (
              <Tab
                key={label}
                label={
                  <span className="font-semibold text-lg sm:text-xl">{label}</span>
                }
                value={index}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  padding: '16px 8px', // Increased padding for height impact
                  borderRadius: '10px 10px 0 0',
                  transition: 'all 0.3s ease-in-out',
                  color: index === selectedTab ? 'white' : 'text.secondary',
                  backgroundColor: index === selectedTab ? '#0d47a1' : 'transparent',
                  // Added a blue border at the bottom for selected tab to maintain visual separation
                  borderBottom: index === selectedTab ? '2px solid #0d47a1' : '2px solid transparent',
                  '&.Mui-selected': {
                    color: 'white',
                    backgroundColor: '#0d47a1',
                  },
                  '&:not(.Mui-selected)': {
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }
                }}
              />
            ))}
          </Tabs>
        </AppBar>
        
        {/* Horizontal Line separating Tabs from Filters/Controls */}
        <hr className="border-t border-gray-200 -mt-4 mb-6" />

        {/* 2. Filter/Control Section */}
        {/* Removed border-b from this box and added it to the overall container below the tabs */}
        <Box className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8 pb-6">

          {/* Risk Type Buttons (Segmented Control style) */}
          <Box className="flex items-center space-x-4">
            <Typography variant="body1" className="text-gray-700 font-medium">Risk Type</Typography>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {['Supplier', 'Performance', 'Compliance'].map((type) => (
                <Button
                  key={type}
                  variant="text"
                  onClick={() => setRiskType(type)}
                  sx={{
                    minWidth: 'auto',
                    padding: '6px 16px',
                    borderRadius: '6px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: riskType === type ? 'white' : 'text.primary',
                    backgroundColor: riskType === type ? '#0d47a1' : 'transparent',
                    boxShadow: riskType === type ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                    '&:hover': {
                      backgroundColor: riskType === type ? '#0d47a1' : 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  {type}
                </Button>
              ))}
            </div>
          </Box>

          {/* Risk Category Dropdown (Updated: Closer to Ant Design simple box) */}
          <Box className="flex items-center space-x-4">
            <Typography variant="body1" className="text-gray-700 font-medium">Risk Category</Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={riskCategory}
                onChange={(e) => setRiskCategory(e.target.value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Risk Category Select' }}
                sx={{
                  borderRadius: '4px', // Tighter radius for a rectangular look
                  backgroundColor: 'white', // Ensure white background
                  boxShadow: 'none',

                  // Styling the input field border for a subtle look (closer to image)
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e5e7eb', // Light gray border
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d1d5db !important', // Slightly darker hover
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d1d5db !important', // Keep border subtle on focus
                    borderWidth: '1px !important', // Ensure consistent border size
                  },

                  // Styling the text inside the select
                  '.MuiSelect-select': {
                    padding: '6px 12px',
                    fontWeight: 600,
                    color: riskCategory === 'High' ? '#ef4444' : riskCategory === 'Medium' ? '#f59e0b' : '#10b981',
                  },
                  
                  // Ensure the select wrapper (MuiInputBase) is white
                  '& .MuiInputBase-root': {
                    backgroundColor: 'white',
                  }
                }}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* 3. Main Content / Visualization Section */}
        <Box className="mt-2">
          <Typography variant="h6" className="font-bold text-blue-600 mb-6 flex items-center">
            Plant Risk Distribution
            <span className="ml-2 text-blue-500 cursor-pointer text-xl">ⓘ</span>
          </Typography>

          {/* Gauge Display */}
          <div className="flex flex-wrap gap-8 justify-start">
            <CustomRiskGauge
              score={91}
              plantName="Heilbronn"
              plantCode="A502-SW-2B-SI"
              tag1="High"
              tag2="Food"
              onGenerateStrategy={generateRiskStrategy}
              onGenerateTts={generateTtsSummary}
              ttsLoading={ttsLoading}
            />
          </div>

          {/* LLM Strategy Output Section */}
          <Box className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-lg shadow-inner">
            <Typography variant="h6" className="font-semibold text-blue-800 mb-3">
              LLM Generated Risk Mitigation Strategy
            </Typography>
            {strategyLoading && (
              <Box className="flex items-center space-x-2">
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">
                  Generating strategy...
                </Typography>
              </Box>
            )}
            {riskStrategy && (
              <div 
                className="prose text-gray-800"
                // Using dangerouslySetInnerHTML to render markdown/HTML from the API response
                dangerouslySetInnerHTML={{ __html: riskStrategy.replace(/\n/g, '<br/>') }}
              />
            )}
            {!strategyLoading && !riskStrategy && (
              <Typography variant="body2" color="text.secondary">
                Click **"Generate Strategy ✨"** under the plant gauge to get an AI-powered mitigation plan.
              </Typography>
            )}
            
            {/* Audio Playback Element */}
            {audioUrl && (
              <audio src={audioUrl} controls className="mt-4 w-full h-10" />
            )}
          </Box>
        </Box>
      </Box>
    </div>
  );
}
