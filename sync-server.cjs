const fs = require('fs');
const path = require('path');

// Mapping of endpoints to file paths
const ENDPOINT_TO_FILE = {
  'customization': 'public/data/customization.json',
  'home': 'public/data/homeData.json',
  'hr': 'public/data/hr.json',
  'Implementation': 'public/data/Implementation.json',
  'integration': 'public/data/integration-data.json',
  'manufacturing': 'public/data/manufacturing-data.json',
  'netsuite-consulting': 'public/data/netSuiteConsulting.json',
  'payroll': 'public/data/payroll.json',
  'retail': 'public/data/retail-data.json',
  'training': 'public/data/training.json'
};

// Express server for handling file sync
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Sync endpoint that saves data back to individual files
app.post('/sync-file', (req, res) => {
  const { endpoint, data } = req.body;
  
  if (!endpoint || !data) {
    return res.status(400).json({ error: 'Missing endpoint or data' });
  }
  
  const filePath = ENDPOINT_TO_FILE[endpoint];
  if (!filePath) {
    return res.status(400).json({ error: `Unknown endpoint: ${endpoint}` });
  }
  
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write data to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    // Also update the main db.json file
    const dbPath = 'db.json';
    let db = {};
    
    if (fs.existsSync(dbPath)) {
      const dbContent = fs.readFileSync(dbPath, 'utf8');
      db = JSON.parse(dbContent);
    }
    
    db[endpoint] = data;
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    
    res.json({ success: true, message: `Synced ${endpoint} to ${filePath}` });
  } catch (error) {
    console.error('Error syncing file:', error);
    res.status(500).json({ error: 'Failed to sync file' });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`File sync server running on http://localhost:${PORT}`);
});

module.exports = app;