//Imports
import { useState, useEffect } from 'react';
import { Candidate } from '../interfaces/CandidateInterface'; // Candidate interface

const SavedCandidates = () => {
    const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  
    useEffect(() => {
      const loadSavedCandidates = () => {
        const save = localStorage.getItem('savedCandidates');
        if (save) {
          setSavedCandidates(JSON.parse(save));
        }
      };
      loadSavedCandidates();
    }, []);
  
    //haneleRejectedCandidate 
    const handleRejectedCandidate = (username: string) => {
      const updatedSavedCandidates = savedCandidates.filter(candidate => candidate.username !== username);
      setSavedCandidates(updatedSavedCandidates);
      localStorage.setItem('savedCandidates', JSON.stringify(updatedSavedCandidates));
    }
    return (
      <div className ="center-container text-info shadow-xl">
        <h1 className = "text-center text-3xl font-bold mb-4">Potential Candidates</h1>
        {savedCandidates.length === 0 ? (
          <p className ="center-container text-center font-bold">No Saved Candidates found!</p>
        ) : (
            <ul className="list bg-base-100 rounded-box shadow-md">
              {savedCandidates.map((candidate, index) => (
                    <li key={candidate.username} className="list-row">
                    <div className="text-4xl font-thin opacity-30 tabular-nums">{index + 1}</div>
                    <div><img className = "size-20 rounded-box" src={candidate.avatar_url} alt={`${candidate.name}'s avatar`}/></div>
                    <div className="list-col-grow">
                    <div className="text-xl uppercase font-semibold tracking-wide">Username: {candidate.username|| "Username Not Available"}</div>
                    <div className="text-xs uppercase font-semibold mt-3 tracking-wide ">Name: {candidate.name || "Name Not Available"}</div>
                    <div className="text-xs uppercase font-semibold mt-1 tracking-wide">Location: {candidate.location || "Location Not Available"}</div>
                    <div className="text-xs uppercase font-semibold mt-1 tracking-wide">Company: {candidate.company || "Company Not Available"}</div>
                    <div className="text-xs uppercase font-semibold mt-1 tracking-wide">Email: {candidate.email || "Email Not Available"}</div>
                    <div className="text-xs uppercase font-semibold mt-1 tracking-wide">Github: {candidate.html_url || "URL Not Available"}</div>
                    </div>
                    <button className="btn btn-warning" onClick={() => handleRejectedCandidate(candidate.username)}>Reject</button>
                </li>
              ))}
            </ul>
          )}
      </div>
    );
  };
  
  export default SavedCandidates;