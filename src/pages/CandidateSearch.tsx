//Imports
import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/CandidateInterface';

// CandidateSearch component
const CandidateSearch = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  //useEffect
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const candidateList = await searchGithub(); //fetching candidates from the API
        console.log('Fetched candidates:', candidateList);

        //map data
        const mappedCandidates = candidateList.map((user: any) => ({
          username: user.login,
          avatar_url: user.avatar_url,
          name: user.name || user.login || 'Name not provided',
          location: user.location || 'Location not provided',
          company: user.company || 'Company not provided',
          email: user.email || 'Public email not provided',
          html_url: user.html_url,
        }));

        console.log('Mapped candidates:', mappedCandidates);
        setCandidates(mappedCandidates);

        if (mappedCandidates.length > 0) {
          const userDetails = await searchGithubUser(mappedCandidates[0].username); //fetching user details from the API
          const updatedCandidates = [...mappedCandidates];
          updatedCandidates[0] = userDetails;
          setCandidates(updatedCandidates);
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error('error fetching candidates', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);
  
  const handleSaveCandidate = () => {
    if (candidates[currentIndex]) {
      //retrieve existing saved candidates from local storage
      const existingSavedCandidates: Candidate[] = JSON.parse(localStorage.getItem('savedCandidates') || '[]');

      //save the current candidate
      const updatedSavedCandidates: Candidate[] = [...existingSavedCandidates, candidates[currentIndex]];
      
      //update local storage with new list of saved candidates
      localStorage.setItem('savedCandidates', JSON.stringify(updatedSavedCandidates));
      nextCandidate();
    }
  };
  

  const nextCandidate = async () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < candidates.length) {
      const userDetails = await searchGithubUser(candidates[nextIndex].username);
      setCandidates((prev) => {
        const updatedCandidates = [...prev];
        updatedCandidates[nextIndex] = userDetails;
        return updatedCandidates;
      });
      setCurrentIndex(nextIndex);
    } else {
      console.log('No more candidates to show');
    }
  };

  const currentCandidate = candidates[currentIndex];
  if (loading) {
    return <p className ="center-container text-center font-bold">Loading Candidates...</p>;
  }
  if(!currentCandidate) {
    return <p className ="center-container text-center font-bold" >No candidates found</p>;
  }

  return (
    <div className = "card center-container card-compact mt-4 bg-base-200/ w-96 shadow-xl">
         {currentCandidate && ( <img className = "max-w-auto max-h-auto aspect-video" src={currentCandidate.avatar_url} alt={`${currentCandidate.name}'s avatar`} /> )}
        <div className = "card-body">
            <h2 className ="card-title text-primary">Potential Candidate</h2>
            <h2 className = "text-info">{currentCandidate.name || 'Name Not Available'}</h2>
            <p>Username: {currentCandidate.username || 'Username Not Available'}</p>
            <p>Company: {currentCandidate.company || 'Company Not Available'}</p>
            <p>Location: {currentCandidate.location || 'Location Not Available'}</p>
            <p>Email: {currentCandidate.email || 'Email Not Available'}</p>
            <p>Github: {currentCandidate.html_url || 'Github URL Not Available'}</p>
            <div className="card-actions justify-center w-full mt-3">
            <button className='btn btn-success ' onClick={handleSaveCandidate}>Save Now</button>
            <button className='btn btn-error ' onClick={nextCandidate}>Reject/Pass</button>
            </div>
        </div>
    </div>
  );
};
export default CandidateSearch;