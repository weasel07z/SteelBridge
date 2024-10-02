import pandas as pd
# import matplotlib.pyplot as plt

# Close all previous figures to avoid blank ones
# plt.close('all')

# Read the CSV file, skipping the second row with units
try:
    df = pd.read_csv("JointData.csv", skiprows=1)  # Edit your csv to get rid of the title, and have it start with the column names as the top row
except Exception as e:
    print(f"Error reading JointData.csv: {e}")

# Set headers and preprocess the data
headers = ['Joint', 'OutputCase', 'CaseType', 'StepType', 'StepNum', 'U1', 'U2', 'U3', 'R1', 'R2', 'R3']
df.columns = headers

# Handle missing values in StepType and StepNum
df['StepType'] = df['StepType'].fillna('Unknown')
df['StepNum'] = pd.to_numeric(df['StepNum'], errors='coerce').fillna(0).astype(int)

# Convert the 'Joint' column to integer, handling errors
df['Joint'] = pd.to_numeric(df['Joint'], errors='coerce').dropna().astype(int)

# Convert numeric columns to appropriate types
for col in ['U1', 'U2', 'U3', 'R1', 'R2', 'R3']:
    df[col] = pd.to_numeric(df[col], errors='coerce')

# Initialize list to store results
joint_u3_data = []
u3Average = 0.0
for joint_value in range(5, 16):  # put your joints here.
    output_case_value = f'LCB{joint_value - 3}'  # edit the correlation from the joint --> LCB
    specific_value = df[(df['Joint'] == joint_value) & (df['OutputCase'].str.strip() == output_case_value)]
    if not specific_value.empty:
        u3_value = specific_value['U3'].values[0]
        joint_u3_data.append({'Joint': joint_value, 'U3': u3_value * 12})
        u3Average += u3_value
u3Average = u3Average/len(joint_u3_data)
print(u3Average)

# Create DataFrame and set index
u3_df = pd.DataFrame(joint_u3_data)
u3_df.set_index('Joint', inplace=True)

# Print the DataFrame to verify data
print("U3 DataFrame:")
print(u3_df)

# Find the maximum and minimum U3 values
max_value = u3_df['U3'].max()
min_value = u3_df['U3'].min()

# Print max and min values for debugging
print(f"Maximum U3 Value: {max_value} inches")
print(f"Minimum U3 Value: {min_value} inches")

# Plot with specified colors
# ax = u3_df.plot(kind='bar', legend=False)
# plt.title('U3 Values for Joints 5 to 15', fontsize=14)
# plt.xlabel('Joint', fontsize=12)
# plt.ylabel('U3 Value (inches)', fontsize=12)
# plt.gca().invert_yaxis()  # Invert the y-axis
# plt.tight_layout()
# plt.show()  # Show the plot
