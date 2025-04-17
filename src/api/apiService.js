// VERY BASIC Placeholder API Service using fetch
// Replace with your actual backend endpoints and logic

const API_BASE_URL = '/api/admin/v1'; // Example - Adjust to your actual backend URL/proxy
const FAKE_DELAY = 500; // Simulate network latency

// Helper to simulate delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to add Authorization header
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// --- Auth ---
export const loginUser = async (username, password) => {
    console.log('Attempting login for:', username);
    await delay(FAKE_DELAY);
    // ** REPLACE WITH ACTUAL API CALL **
    // const response = await fetch('/admin/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ username, password }),
    // });
    // if (!response.ok) throw new Error('Login failed');
    // const data = await response.json();
    // return data.token; // Assuming API returns { token: '...' }

    // --- FAKE IMPLEMENTATION ---
    if (username === 'admin' && password === 'password') {
        const fakeToken = `fake-token-${Date.now()}`;
        console.log('Fake login successful, token:', fakeToken);
        return fakeToken;
    } else {
        console.error('Fake login failed');
        throw new Error('Invalid credentials (use admin/password for demo)');
    }
    // --- END FAKE ---
};

// --- Quests ---
export const fetchQuests = async () => {
    console.log('Fetching quests...');
    await delay(FAKE_DELAY);
    // ** REPLACE WITH ACTUAL API CALL **
    // const response = await fetch(`${API_BASE_URL}/quests`, { headers: getAuthHeaders() });
    // if (!response.ok) throw new Error('Failed to fetch quests');
    // return await response.json(); // Assuming API returns { data: [], totalCount: 0 }

    // --- FAKE IMPLEMENTATION ---
    return {
        data: [
            { id: 'q1', title: 'Daily Kilometre Challenge', status: 'active', difficulty: 'Easy', startDate: '2023-11-01T00:00:00Z', endDate: '2023-11-01T23:59:59Z', rewardCollectibleId: 'c1' },
            { id: 'q2', title: 'Discover a New Country', status: 'inactive', difficulty: 'Hard', startDate: '2023-11-01T00:00:00Z', endDate: '2023-11-30T23:59:59Z', rewardCollectibleId: 'c2' },
        ],
        totalCount: 2
    };
    // --- END FAKE ---
};

export const fetchQuestById = async (id) => {
    console.log(`Fetching quest ${id}...`);
    await delay(FAKE_DELAY);
    // ** REPLACE WITH ACTUAL API CALL **
    // const response = await fetch(`${API_BASE_URL}/quests/${id}`, { headers: getAuthHeaders() });
    // if (!response.ok) throw new Error(`Failed to fetch quest ${id}`);
    // return await response.json();

     // --- FAKE IMPLEMENTATION ---
    const quests = (await fetchQuests()).data;
    const quest = quests.find(q => q.id === id);
    if (!quest) throw new Error(`Quest ${id} not found`);
    return quest;
     // --- END FAKE ---
};

export const createQuest = async (questData) => {
    console.log('Creating quest:', questData);
    await delay(FAKE_DELAY);
    // ** REPLACE WITH ACTUAL API CALL **
    // const response = await fetch(`${API_BASE_URL}/quests`, {
    //     method: 'POST',
    //     headers: getAuthHeaders(),
    //     body: JSON.stringify(questData),
    // });
    // if (!response.ok) throw new Error('Failed to create quest');
    // return await response.json();

     // --- FAKE IMPLEMENTATION ---
     const newQuest = { ...questData, id: `q${Date.now()}`, status: 'inactive' }; // Assign fake ID
     console.log('Fake quest created:', newQuest);
     return newQuest;
     // --- END FAKE ---
};

export const updateQuest = async (id, questData) => {
    console.log(`Updating quest ${id}:`, questData);
     await delay(FAKE_DELAY);
    // ** REPLACE WITH ACTUAL API CALL **
    // const response = await fetch(`${API_BASE_URL}/quests/${id}`, {
    //     method: 'PUT', // or PATCH
    //     headers: getAuthHeaders(),
    //     body: JSON.stringify(questData),
    // });
    // if (!response.ok) throw new Error(`Failed to update quest ${id}`);
    // return await response.json();

     // --- FAKE IMPLEMENTATION ---
     console.log(`Fake quest ${id} updated.`);
     return { ...questData, id }; // Return updated data merged with ID
     // --- END FAKE ---
};

export const updateQuestStatus = async (id, status) => {
    console.log(`Updating quest ${id} status to ${status}...`);
    await delay(FAKE_DELAY/2);
    // ** REPLACE WITH ACTUAL API CALL **
    // Use PATCH /activate or /deactivate endpoints as designed
    // const endpoint = status === 'active' ? 'activate' : 'deactivate';
    // const response = await fetch(`${API_BASE_URL}/quests/${id}/${endpoint}`, {
    //     method: 'PATCH',
    //     headers: getAuthHeaders(),
    // });
    // if (!response.ok) throw new Error(`Failed to update quest ${id} status`);
    // return await response.json(); // Return the updated quest object

     // --- FAKE IMPLEMENTATION ---
     console.log(`Fake quest ${id} status updated to ${status}.`);
     // In real scenario, return the full updated quest object from API
     return { success: true, status };
     // --- END FAKE ---
}

// --- Collectibles ---
export const fetchCollectibles = async () => {
    console.log('Fetching collectibles...');
    await delay(FAKE_DELAY);
    // ** REPLACE WITH ACTUAL API CALL **
    // const response = await fetch(`${API_BASE_URL}/collectibles`, { headers: getAuthHeaders() });
    // if (!response.ok) throw new Error('Failed to fetch collectibles');
    // return await response.json(); // Assuming { data: [], totalCount: 0 }

     // --- FAKE IMPLEMENTATION ---
    return {
        data: [
            { id: 'c1', name: 'Kilometre Coin', imageUrl: 'https://via.placeholder.com/50/09f/fff.png?text=KM' },
            { id: 'c2', name: 'Country Discoverer Badge', imageUrl: 'https://via.placeholder.com/50/f90/fff.png?text=CTY' },
            { id: 'c3', name: 'Daily Login Streak Star', imageUrl: 'https://via.placeholder.com/50/90f/fff.png?text=STR' },
        ],
        totalCount: 3
    };
     // --- END FAKE ---
};

export const fetchCollectibleById = async (id) => {
    console.log(`Fetching collectible ${id}...`);
    await delay(FAKE_DELAY);
    // ** REPLACE WITH ACTUAL API CALL **
    // const response = await fetch(`${API_BASE_URL}/collectibles/${id}`, { headers: getAuthHeaders() });
    // if (!response.ok) throw new Error(`Failed to fetch collectible ${id}`);
    // return await response.json();

     // --- FAKE IMPLEMENTATION ---
    const collectibles = (await fetchCollectibles()).data;
    const collectible = collectibles.find(c => c.id === id);
    if (!collectible) throw new Error(`Collectible ${id} not found`);
    return collectible;
     // --- END FAKE ---
};


export const createCollectible = async (formData) => { // Expect FormData
    console.log('Creating collectible (FormData)...');
    // You won't see file data easily in console.log(formData)
    // Log individual fields instead if needed: console.log(formData.get('name'));
    await delay(FAKE_DELAY);

    // ** REPLACE WITH ACTUAL API CALL **
    // const response = await fetch(`${API_BASE_URL}/collectibles`, {
    //     method: 'POST',
    //     headers: { // Content-Type is set automatically by browser for FormData
    //        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    //     },
    //     body: formData, // Send FormData directly
    // });
    // if (!response.ok) {
    //     const errorBody = await response.text(); // Try to get error details
    //     throw new Error(`Failed to create collectible: ${errorBody}`);
    // }
    // return await response.json();

     // --- FAKE IMPLEMENTATION ---
     const newCollectible = {
        id: `c${Date.now()}`,
        name: formData.get('name'), // Get data from FormData
        // Cannot easily fake image URL upload result here
        imageUrl: 'https://via.placeholder.com/50/ccc/000.png?text=NEW'
     };
     console.log('Fake collectible created:', newCollectible);
     return newCollectible;
     // --- END FAKE ---
}

export const updateCollectible = async (id, formData) => { // Expect FormData
    console.log(`Updating collectible ${id} (FormData)...`);
    await delay(FAKE_DELAY);

    // ** REPLACE WITH ACTUAL API CALL **
    // Use PUT or PATCH, depending on your API design
    // const response = await fetch(`${API_BASE_URL}/collectibles/${id}`, {
    //     method: 'PUT', // Or 'PATCH'
    //     headers: {
    //        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    //     },
    //     body: formData,
    // });
    // if (!response.ok) {
    //      const errorBody = await response.text();
    //      throw new Error(`Failed to update collectible ${id}: ${errorBody}`);
    // }
    // return await response.json();

     // --- FAKE IMPLEMENTATION ---
     console.log(`Fake collectible ${id} updated.`);
     // Return data based on what the form expects (name is useful)
     // The image URL might not change immediately in the fake version
     const existing = await fetchCollectibleById(id); // Get existing for image URL
     return {
        id,
        name: formData.get('name'),
        imageUrl: existing.imageUrl // Keep old URL in fake mode unless image changed
    };
     // --- END FAKE ---
};

export const deleteCollectible = async (id) => {
    console.log(`Deleting collectible ${id}...`);
    await delay(FAKE_DELAY / 2);
     // ** REPLACE WITH ACTUAL API CALL **
    // const response = await fetch(`${API_BASE_URL}/collectibles/${id}`, {
    //     method: 'DELETE',
    //     headers: getAuthHeaders(),
    // });
    // if (!response.ok && response.status !== 204) { // Handle 204 No Content success
    //     const errorBody = await response.text();
    //      throw new Error(`Failed to delete collectible ${id}: ${errorBody}`);
    // }
    // return { success: true }; // Or parse response if backend returns something

    // --- FAKE IMPLEMENTATION ---
    console.log(`Fake collectible ${id} deleted.`);
    return { success: true };
    // --- END FAKE ---
}

// --- Business Metrics ---
export const fetchDashboardStats = async () => {
    console.log('Fetching dashboard stats...');
    await delay(FAKE_DELAY);
    // ** REPLACE WITH ACTUAL API CALL(s) **
    // Example: Fetch signups, active users etc. from your existing API or new admin endpoints
    // const signupResponse = await fetch(`/api/v1/users/count`, { headers: getAuthHeaders() });
    // ... other calls ...
    // if (!signupResponse.ok) throw new Error('Failed to fetch stats');
    // const signupData = await signupResponse.json();

    // --- FAKE IMPLEMENTATION ---
    return {
        totalSignups: 12345,
        dailyActiveUsers: 850,
        activeQuests: 1, // Count from fetchQuests maybe?
        totalCollectibles: 3 // Count from fetchCollectibles maybe?
    };
    // --- END FAKE ---
};
