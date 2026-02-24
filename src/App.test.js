import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

const mockPathways = [
  {
    id: 'provider-visit',
    title: 'Schedule provider follow-up',
    description: 'Prepare symptoms, medication notes, and targeted questions.',
    effort: 'medium',
    type: 'medical',
    priority: 1,
  },
  {
    id: 'sleep-routine',
    title: 'Build sleep routine',
    description: 'Use consistent lights-out timing and wind-down steps.',
    effort: 'medium',
    type: 'lifestyle',
    priority: 2,
  },
];

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: async () => mockPathways,
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders app title and loaded cards', async () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /lymepath/i })).toBeInTheDocument();
  expect(await screen.findByText(/schedule provider follow-up/i)).toBeInTheDocument();
});

test('hydrates filters from local storage', async () => {
  localStorage.setItem(
    'lymepath.filters',
    JSON.stringify({
      query: 'sleep',
      selectedEffort: 'all',
      selectedType: 'all',
      sortBy: 'priority',
    })
  );

  render(<App />);

  await waitFor(() => {
    expect(screen.getByLabelText(/search/i)).toHaveValue('sleep');
  });

  expect(await screen.findByText(/build sleep routine/i)).toBeInTheDocument();
  expect(screen.queryByText(/schedule provider follow-up/i)).not.toBeInTheDocument();
});
