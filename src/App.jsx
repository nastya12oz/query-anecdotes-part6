import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from './requests'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { NotificationProvider } from './components/NotificationContext'
import React from 'react';
import { useNotification } from './components/useNotification'




const App = () => {
  const queryClient = useQueryClient()

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']);
      const updatedAnecdotes = anecdotes.map((anecdote) =>
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      );
      queryClient.setQueryData(['anecdotes'], updatedAnecdotes);
    },
  });
  
console.log(useNotification());
  const { dispatch } = useNotification();

  const handleVote = (anecdote) => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    updateAnecdoteMutation.mutate(updatedAnecdote);
    dispatch({ type: 'SET_NOTIFICATION', payload: `Anecdote "${anecdote.content}" voted!` });
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' });
    }, 5000);
  };

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false
  })
  console.log(JSON.parse(JSON.stringify(result)))

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  const anecdotes = result.data

  return (
    <React.StrictMode>

        <div>
          <h3>Anecdote app</h3>
        
          <Notification />
          <AnecdoteForm />
        
          {anecdotes.map(anecdote =>
            <div key={anecdote.id}>
              <div>
                {anecdote.content}
              </div>
              <div>
                has {anecdote.votes}
                <button onClick={() => handleVote(anecdote)}>vote</button>
              </div>
            </div>
          )}
        </div>
    </React.StrictMode>
  )
}

export default App
