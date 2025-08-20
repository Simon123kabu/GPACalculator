import { useState } from "react";
import "./App.css";

const levels = [100, 200, 300, 400];
const semesters = ["semester1", "semester2"];

function App() {
  const initialData = {};
  levels.forEach((level) => {
    initialData[level] = {};
    semesters.forEach((sem) => {
      initialData[level][sem] = { gpa: "", credits: "" };
    });
  });

  const [data, setData] = useState(initialData);
  const [results, setResults] = useState({
    semesterGPAs: {},
    cumulativeGPA: null,
    totalCredits: 0,
    totalPoints: 0,
  });
  const [openLevels, setOpenLevels] = useState(new Set());
  const [openSemesters, setOpenSemesters] = useState({});

  const toggleLevel = (level) => {
    setOpenLevels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(level)) {
        newSet.delete(level);
        setOpenSemesters((prevSem) => {
          const newSem = { ...prevSem };
          delete newSem[level];
          return newSem;
        });
      } else {
        newSet.add(level);
      }
      return newSet;
    });
  };

  const toggleSemester = (level, sem) => {
    setOpenSemesters((prev) => {
      const newPrev = { ...prev };
      if (!newPrev[level]) newPrev[level] = new Set();
      const semSet = new Set(newPrev[level]);
      if (semSet.has(sem)) {
        semSet.delete(sem);
      } else {
        semSet.add(sem);
      }
      newPrev[level] = semSet;
      return newPrev;
    });
  };

  const updateSemester = (level, semester, field, value) => {
    setData((prev) => {
      const newData = { ...prev };
      newData[level][semester] = { ...newData[level][semester], [field]: value };
      return newData;
    });
  };

  const calculateGPAs = () => {
    const semesterGPAs = {};
    let overallPoints = 0;
    let overallCredits = 0;

    levels.forEach((level) => {
      semesterGPAs[level] = {};
      semesters.forEach((sem) => {
        const entry = data[level][sem];
        let semGPA = null;
        let semCredits = 0;
        if (
          entry.gpa &&
          !isNaN(parseFloat(entry.gpa)) &&
          entry.credits &&
          !isNaN(parseFloat(entry.credits))
        ) {
          semGPA = parseFloat(entry.gpa);
          semCredits = parseFloat(entry.credits);
          overallPoints += semGPA * semCredits;
          overallCredits += semCredits;
        }
        semesterGPAs[level][sem] = semGPA;
      });
    });

    const cumulativeGPA =
      overallCredits > 0 ? overallPoints / overallCredits : null;

    setResults({
      semesterGPAs,
      cumulativeGPA,
      totalCredits: overallCredits,
      totalPoints: overallPoints,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center p-6">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center mb-4 text-indigo-700">
          🎓 University GPA Calculator
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Expand a level → open a semester → add your semester GPA and total credits. Leave unused fields blank.
        </p>

        <div className="space-y-6">
          {levels.map((level) => (
            <div key={level} className="border border-indigo-200 rounded-lg">
              <button
                onClick={() => toggleLevel(level)}
                className="w-full flex justify-between items-center p-4 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-xl font-bold rounded-t-lg transition"
              >
                Level {level}
                <span>{openLevels.has(level) ? "−" : "+"}</span>
              </button>
              {openLevels.has(level) && (
                <div className="p-4 space-y-4 bg-indigo-50">
                  {semesters.map((sem) => (
                    <div key={sem} className="border border-purple-200 rounded">
                      <button
                        onClick={() => toggleSemester(level, sem)}
                        className="w-full flex justify-between items-center p-3 bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold transition"
                      >
                        {sem.replace("semester", "Semester ")}
                        <span>
                          {openSemesters[level]?.has(sem) ? "−" : "+"}
                        </span>
                      </button>
                      {openSemesters[level]?.has(sem) && (
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                            <label className="text-sm font-medium text-gray-700">Semester GPA:</label>
                            <input
                              type="number"
                              value={data[level][sem].gpa}
                              onChange={(e) =>
                                updateSemester(level, sem, "gpa", e.target.value)
                              }
                              placeholder="e.g. 9.5"
                              min="0"
                              max="12"
                              step="0.01"
                              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-400"
                            />
                          </div>
                          <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                            <label className="text-sm font-medium text-gray-700">Total Credits:</label>
                            <input
                              type="number"
                              value={data[level][sem].credits}
                              onChange={(e) =>
                                updateSemester(level, sem, "credits", e.target.value)
                              }
                              placeholder="e.g. 20"
                              min="0"
                              step="0.5"
                              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-400"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={calculateGPAs}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition"
          >
            Calculate Cumulative GPA 🚀
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl mt-10 shadow-inner">
          <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
            📊 Results
          </h2>
          {levels.map((level) => (
            <div key={level} className="mb-4">
              <h3 className="text-xl font-semibold text-purple-800">
                Level {level}
              </h3>
              {semesters.map((sem) => (
                <p key={sem} className="ml-4 text-gray-700">
                  {sem.replace("semester", "Semester ")} GPA:{" "}
                  {results.semesterGPAs[level]?.[sem] !== null &&
                  results.semesterGPAs[level]?.[sem] !== undefined
                    ? results.semesterGPAs[level][sem].toFixed(2)
                    : "N/A"}
                </p>
              ))}
            </div>
          ))}
          <div className="text-center mt-6 space-y-2">
            <p className="text-lg font-bold text-indigo-800">
              Cumulative GPA:{" "}
              {results.cumulativeGPA !== null
                ? results.cumulativeGPA.toFixed(2)
                : "N/A"}
            </p>
            <p className="text-sm text-gray-700">
              Total Credits: {results.totalCredits}
            </p>
            <p className="text-sm text-gray-700">
              Total Points: {results.totalPoints.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;