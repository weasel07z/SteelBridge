const fs = require('fs');
const csv = require('csv-parser');

// Initialize variables
let headers = ['Joint', 'OutputCase', 'CaseType', 'StepType', 'StepNum', 'U1', 'U2', 'U3', 'R1', 'R2', 'R3'];
let data = [];
let joint_u3_data = [];
let u3Average = 0.0;

// Read the CSV file, skipping the second row
export function readCSV() {
    fs.createReadStream('JointData.csv')
  .pipe(csv({ headers: headers, skipLines: 1 }))
  .on('data', (row) => {
    // Preprocess data: convert fields to numbers and handle missing values
    row.StepType = row.StepType ? row.StepType : 'Unknown';
    row.StepNum = row.StepNum ? parseInt(row.StepNum) : 0;
    row.Joint = parseInt(row.Joint) || null;

    ['U1', 'U2', 'U3', 'R1', 'R2', 'R3'].forEach(col => {
      row[col] = parseFloat(row[col]) || null;
    });

    // Add the processed row to data array
    data.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed.');

    // Loop through joint values and calculate U3 average
    for (let joint_value = 5; joint_value < 16; joint_value++) {
      let output_case_value = `LCB${joint_value - 3}`;

      // Filter for specific joint and output case
      let specific_value = data.find(row => row.Joint === joint_value && row.OutputCase.trim() === output_case_value);

      if (specific_value) {
        let u3_value = specific_value.U3;
        joint_u3_data.push({ 'Joint': joint_value, 'U3': u3_value * 12 });
        u3Average += u3_value;
      }
    }

    u3Average = u3Average / joint_u3_data.length;
    console.log('U3 Average:', u3Average);

    // Create a new object to store the data as a key-value pair with Joint as key
    let u3_df = {};
    joint_u3_data.forEach(entry => {
      u3_df[entry.Joint] = entry.U3;
    });

    console.log('U3 DataFrame:');
    console.log(u3_df);

    // Find the max and min U3 values
    let u3_values = joint_u3_data.map(entry => entry.U3);
    let max_value = Math.max(...u3_values);
    let min_value = Math.min(...u3_values);

    console.log('Maximum U3 Value:', max_value, 'inches');
    console.log('Minimum U3 Value:', min_value, 'inches');
  })
  .on('error', (error) => {
    console.error('Error reading the CSV file:', error);
  });
}

