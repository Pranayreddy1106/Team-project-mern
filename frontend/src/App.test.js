import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import AuthProvider from './context/AuthContext';

test('renders EduFlow home page', () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );

  expect(screen.getByRole('link', { name: /EduFlow/i })).toBeInTheDocument();
  expect(screen.getByText(/Learn Smarter/i)).toBeInTheDocument();
});
