import os
import requests

UPLOAD_URL = "http://localhost:8000/api/v1/documents/upload"
OUTPUT_DIR = "uploads"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Generate realistic KTU PYQP data for ingestion
resources = {
    "ktu_cst302_pyqp.txt": """
=====================================================
APJ ABDUL KALAM TECHNOLOGICAL UNIVERSITY
SIXTH SEMESTER B.TECH DEGREE EXAMINATION
Course Code: CST 302
Course Name: COMPILER DESIGN
Max Marks: 100
Duration: 3 Hours
=====================================================

PART A (Answer all questions, each carries 3 marks)
1. Define Lexical Analysis and identify the tokens in `a = b + c * 10;`.
2. Construct the NFA for the regular expression `(a|b)*abb`.
3. What is left recursion? Eliminate left recursion from the grammar: A -> Aα | β.
4. Differentiate between parse tree and abstract syntax tree.
5. Define Three Address Code (TAC). Give the TAC for `x = -y * z`.

PART B (Answer any one full question from each module, each carries 14 marks)
MODULE 1
11. a) Explain the various phases of a compiler with a neat block diagram, illustrating the compilation of the statement `position = initial + rate * 60`. (10 marks)
    b) Explain compiler construction tools. (4 marks)
MODULE 2
13. a) Compute the FIRST and FOLLOW sets for the following grammar and construct the LL(1) parsing table:
       E  -> TE'
       E' -> +TE' | ε
       T  -> FT'
       T' -> *FT' | ε
       F  -> (E) | id
       (14 marks)
""",
    
    "ktu_cst306_pyqp.txt": """
=====================================================
APJ ABDUL KALAM TECHNOLOGICAL UNIVERSITY
SIXTH SEMESTER B.TECH DEGREE EXAMINATION
Course Code: CST 306
Course Name: ALGORITHM ANALYSIS AND DESIGN
Max Marks: 100
Duration: 3 Hours
=====================================================

PART A (Answer all questions, each carries 3 marks)
1. Define Big O, Omega, and Theta notations.
2. What is the time complexity of binary search? Justify.
3. State the Master Theorem.
4. Explain the concept of Dynamic Programming.
5. What is minimum spanning tree? 

PART B (Answer any one full question from each module, each carries 14 marks)
MODULE 1
11. a) Solve the recurrence relation T(n) = 2T(n/2) + O(n) using the Master Theorem. (7 marks)
    b) Write the algorithm for Merge Sort and analyze its time complexity in best, average, and worst cases. (7 marks)
MODULE 3
15. a) Find the longest common subsequence (LCS) for the strings X = "ABCBDAB" and Y = "BDCABA". Keep track of the DP table. (10 marks)
""",

    "ktu_cst304_pyqp.txt": """
=====================================================
APJ ABDUL KALAM TECHNOLOGICAL UNIVERSITY
SIXTH SEMESTER B.TECH DEGREE EXAMINATION
Course Code: CST 304
Course Name: COMPUTER GRAPHICS AND IMAGE PROCESSING
Max Marks: 100
Duration: 3 Hours
=====================================================

PART A (Answer all questions, each carries 3 marks)
1. Distinguish between raster scan and random scan displays.
2. What are the basic 2D transformations? Give the matrix representations.
3. Explain Cohen-Sutherland line clipping algorithm briefly.
4. Define spatial resolution and gray level resolution.
5. What is histogram equalization?

PART B (Answer any one full question from each module, each carries 14 marks)
MODULE 1
11. a) Derive Bresenham's line drawing algorithm for |m| < 1. Using the algorithm, plot the pixels for a line from (20, 10) to (30, 18). (10 marks)
    b) Explain the working principle of CRT. (4 marks)
"""
}

def run_ingestion():
    print("Starting KTU Resource Ingestion...")
    for filename, content in resources.items():
        filepath = os.path.join(OUTPUT_DIR, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
            
        print(f"Uploading {filename} to Vector DB...")
        with open(filepath, "rb") as f:
            try:
                response = requests.post(UPLOAD_URL, files={"file": f})
                if response.status_code == 200:
                    print(f"SUCCESS: {filename} embedded!")
                else:
                    print(f"FAILED: {filename}. Status: {response.status_code}")
            except Exception as e:
                print(f"ERROR: {e}")

if __name__ == "__main__":
    run_ingestion()
