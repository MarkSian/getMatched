import { Candidate } from '../interfaces/CandidateInterface';
//searchGithub
const searchGithub = async () => {
    try {
      const start = Math.floor(Math.random() * 100000000) + 1;
      const response = await fetch(
        `https://api.github.com/users?since=${start}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
          },
        }
      );
      const data =await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch data');
      }
        return data;
    } catch (err) {
        return [];
    }
};

const searchGithubUser = async (username: string): Promise<Candidate> => {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
            },
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return {
            name: data.name,
            username: data.login,
            location: data.location,
            company: data.company,
            avatar_url: data.avatar_url,
            html_url: data.html_url,
            email: data.email,
        } as Candidate;
    } catch (err) {
        console.log('an error occured', err);
        return {} as Candidate;
    }
};

export { searchGithub, searchGithubUser };