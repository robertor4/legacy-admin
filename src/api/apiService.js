// VERY BASIC Placeholder API Service using fetch
// Replace with your actual backend endpoints and logic

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/admin/v1'; // Use environment variable or fallback
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
export const loginUser = async (email, password) => {
    console.log('Attempting login for:', email);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Login failed. Please check your credentials.');
        }
        
        const data = await response.json();
        
        // Store both tokens
        localStorage.setItem('authToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        return data.accessToken; // Return access token for the auth context
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

// --- Collections ---
export const fetchCollections = async (params = {}) => {
    console.log('Fetching collections with params:', params);
    
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params.key) queryParams.append('key', params.key);
    if (params.filter) queryParams.append('filter', params.filter);
    if (params.operator) queryParams.append('operator', params.operator);
    if (params.order) queryParams.append('order', params.order);
    if (params.direction) queryParams.append('direction', params.direction);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/collectibles/collections${queryString}`, {
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch collections');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching collections:', error);
        throw error;
    }
};

export const fetchCollectionById = async (id) => {
    console.log(`Fetching collection with ID: ${id}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/collectibles/collections/${id}`, {
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch collection ${id}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching collection ${id}:`, error);
        throw error;
    }
};

export const createCollection = async (collectionData) => {
    console.log('Creating new collection:', collectionData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/collectibles/collections`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(collectionData),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to create collection');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating collection:', error);
        throw error;
    }
};

export const updateCollection = async (id, collectionData) => {
    console.log(`Updating collection ${id}:`, collectionData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/collectibles/collections/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(collectionData),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to update collection ${id}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error updating collection ${id}:`, error);
        throw error;
    }
};

export const deleteCollection = async (id) => {
    console.log(`Deleting collection ${id}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/collectibles/collections/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to delete collection ${id}`);
        }
        
        return { success: true };
    } catch (error) {
        console.error(`Error deleting collection ${id}:`, error);
        throw error;
    }
};

// --- Collectibles ---
export const fetchCollectibles = async (params = {}) => {
    console.log('Fetching collectibles with params:', params);
    
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params.collectionId) queryParams.append('collectionId', params.collectionId);
    if (params.key) queryParams.append('key', params.key);
    if (params.filter) queryParams.append('filter', params.filter);
    if (params.operator) queryParams.append('operator', params.operator);
    if (params.order) queryParams.append('order', params.order);
    if (params.direction) queryParams.append('direction', params.direction);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/collectibles${queryString}`, {
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to fetch collectibles');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching collectibles:', error);
        throw error;
    }
};

export const fetchCollectibleById = async (id) => {
    console.log(`Fetching collectible with ID: ${id}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/collectibles/${id}`, {
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to fetch collectible ${id}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching collectible ${id}:`, error);
        throw error;
    }
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

// --- Subscriptions ---
export const fetchSubscriptions = async () => {
    console.log('Fetching subscriptions...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions`, {
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch subscriptions');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        throw error;
    }
};

export const fetchSubscriptionById = async (id) => {
    console.log(`Fetching subscription with ID: ${id}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/${id}`, {
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch subscription ${id}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching subscription ${id}:`, error);
        throw error;
    }
};

// --- Subscription Plans ---
export const fetchSubscriptionPlans = async () => {
    console.log('Fetching subscription plans...');
    await delay(FAKE_DELAY);
    // ** REPLACE WITH ACTUAL API CALL **
    // const response = await fetch(`${API_BASE_URL}/subscription-plans`, { headers: getAuthHeaders() });
    // if (!response.ok) throw new Error('Failed to fetch subscription plans');
    // return await response.json();

    // --- FAKE IMPLEMENTATION ---
    return {
        data: [
            { 
                id: 'p1', 
                name: 'Basic Plan', 
                description: 'Basic subscription plan',
                price: 9.99,
                productId: 'prod_basic',
                parentPlan: null,
                store: 'app_store'
            },
            { 
                id: 'p2', 
                name: 'Premium Plan', 
                description: 'Premium subscription plan',
                price: 19.99,
                productId: 'prod_premium',
                parentPlan: 'p1',
                store: 'app_store'
            }
        ],
        totalCount: 2
    };
    // --- END FAKE ---
};

export const fetchSubscriptionPlanById = async (id) => {
    console.log(`Fetching subscription plan ${id}...`);
    await delay(FAKE_DELAY);
    // ** REPLACE WITH ACTUAL API CALL **
    // const response = await fetch(`${API_BASE_URL}/subscription-plans/${id}`, { headers: getAuthHeaders() });
    // if (!response.ok) throw new Error(`Failed to fetch subscription plan ${id}`);
    // return await response.json();

    // --- FAKE IMPLEMENTATION ---
    const plans = (await fetchSubscriptionPlans()).data;
    const plan = plans.find(p => p.id === id);
    if (!plan) throw new Error(`Subscription plan ${id} not found`);
    return plan;
    // --- END FAKE ---
};

// Passports API methods
export const fetchPassports = async () => {
    console.log('Fetching passports...');
    // Fake implementation
    return {
        data: [
            {
                id: '1',
                userId: 'user-1',
                firstName: 'John',
                lastName: 'Doe',
                profilePictureUrl: 'https://example.com/profile1.jpg',
                profilePictureThumbnailUrl: 'https://example.com/profile1-thumb.jpg',
                countryOfOrigin: 'USA',
                description: 'Adventure seeker and world traveler',
                passportSequenceNumber: 1,
                passportNumber: 'PASS001',
                kilometersTravelled: 15000,
                continentsCount: 3,
                coins: 1000,
                coinsToday: 50,
                coinsThisWeek: 200,
                coinsThisMonth: 800,
                sqKilometersDiscovered: 5000,
                sqKilometersDiscoveredToday: 100,
                sqKilometersDiscoveredThisWeek: 500,
                sqKilometersDiscoveredThisMonth: 2000,
                countriesCount: 15,
                countriesCountToday: 1,
                countriesCountThisWeek: 3,
                countriesCountThisMonth: 5,
                municipalitiesCount: 25,
                municipalitiesCountToday: 2,
                municipalitiesCountThisWeek: 8,
                municipalitiesCountThisMonth: 15,
                ianaTimezone: 'America/New_York',
                lastVisitedCountry: 'France',
                lastResetProgressDateTime: new Date().toISOString(),
                lastMonthlyResetProgressDateTime: new Date().toISOString(),
                lastWeeklyResetProgressDateTime: new Date().toISOString(),
                coinsSpent: 500,
                searchableText: 'John Doe USA Adventure seeker',
                subscriptionPlanId: 'premium',
                createdDate: new Date().toISOString(),
                createdBy: 'system',
                lastModifiedDate: new Date().toISOString(),
                lastModifiedBy: 'system'
            },
            {
                id: '2',
                userId: 'user-2',
                firstName: 'Jane',
                lastName: 'Smith',
                profilePictureUrl: 'https://example.com/profile2.jpg',
                profilePictureThumbnailUrl: 'https://example.com/profile2-thumb.jpg',
                countryOfOrigin: 'UK',
                description: 'Photography enthusiast and cultural explorer',
                passportSequenceNumber: 2,
                passportNumber: 'PASS002',
                kilometersTravelled: 20000,
                continentsCount: 4,
                coins: 2000,
                coinsToday: 100,
                coinsThisWeek: 400,
                coinsThisMonth: 1600,
                sqKilometersDiscovered: 8000,
                sqKilometersDiscoveredToday: 200,
                sqKilometersDiscoveredThisWeek: 800,
                sqKilometersDiscoveredThisMonth: 3200,
                countriesCount: 20,
                countriesCountToday: 2,
                countriesCountThisWeek: 5,
                countriesCountThisMonth: 8,
                municipalitiesCount: 35,
                municipalitiesCountToday: 3,
                municipalitiesCountThisWeek: 12,
                municipalitiesCountThisMonth: 25,
                ianaTimezone: 'Europe/London',
                lastVisitedCountry: 'Japan',
                lastResetProgressDateTime: new Date().toISOString(),
                lastMonthlyResetProgressDateTime: new Date().toISOString(),
                lastWeeklyResetProgressDateTime: new Date().toISOString(),
                coinsSpent: 800,
                searchableText: 'Jane Smith UK Photography enthusiast',
                subscriptionPlanId: 'premium',
                createdDate: new Date().toISOString(),
                createdBy: 'system',
                lastModifiedDate: new Date().toISOString(),
                lastModifiedBy: 'system'
            }
        ]
    };
};

export const fetchPassportById = async (id) => {
    console.log(`Fetching passport with ID: ${id}`);
    // Fake implementation
    const passport = {
        id,
        userId: `user-${id}`,
        firstName: 'John',
        lastName: 'Doe',
        profilePictureUrl: 'https://example.com/profile.jpg',
        profilePictureThumbnailUrl: 'https://example.com/profile-thumb.jpg',
        countryOfOrigin: 'USA',
        description: 'Adventure seeker and world traveler',
        passportSequenceNumber: 1,
        passportNumber: `PASS${id.padStart(3, '0')}`,
        kilometersTravelled: 15000,
        continentsCount: 3,
        coins: 1000,
        coinsToday: 50,
        coinsThisWeek: 200,
        coinsThisMonth: 800,
        sqKilometersDiscovered: 5000,
        sqKilometersDiscoveredToday: 100,
        sqKilometersDiscoveredThisWeek: 500,
        sqKilometersDiscoveredThisMonth: 2000,
        countriesCount: 15,
        countriesCountToday: 1,
        countriesCountThisWeek: 3,
        countriesCountThisMonth: 5,
        municipalitiesCount: 25,
        municipalitiesCountToday: 2,
        municipalitiesCountThisWeek: 8,
        municipalitiesCountThisMonth: 15,
        ianaTimezone: 'America/New_York',
        lastVisitedCountry: 'France',
        lastResetProgressDateTime: new Date().toISOString(),
        lastMonthlyResetProgressDateTime: new Date().toISOString(),
        lastWeeklyResetProgressDateTime: new Date().toISOString(),
        coinsSpent: 500,
        searchableText: 'John Doe USA Adventure seeker',
        subscriptionPlanId: 'premium',
        createdDate: new Date().toISOString(),
        createdBy: 'system',
        lastModifiedDate: new Date().toISOString(),
        lastModifiedBy: 'system'
    };
    return { data: passport };
};

export const createPassport = async (passportData) => {
    console.log('Creating new passport:', passportData);
    // Fake implementation
    const newPassport = {
        id: Math.random().toString(36).substr(2, 9),
        ...passportData,
        createdDate: new Date().toISOString(),
        createdBy: 'system',
        lastModifiedDate: new Date().toISOString(),
        lastModifiedBy: 'system'
    };
    return { data: newPassport };
};

export const updatePassport = async (id, passportData) => {
    console.log(`Updating passport ${id}:`, passportData);
    // Fake implementation
    const updatedPassport = {
        id,
        ...passportData,
        lastModifiedDate: new Date().toISOString(),
        lastModifiedBy: 'system'
    };
    return { data: updatedPassport };
};

export const deletePassport = async (id) => {
    console.log(`Deleting passport ${id}`);
    // Fake implementation
    return { success: true };
};

// --- Quests ---
export const fetchQuests = async (params = {}) => {
    console.log('Fetching quests with params:', params);
    
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params.key) queryParams.append('key', params.key);
    if (params.filter) queryParams.append('filter', params.filter);
    if (params.operator) queryParams.append('operator', params.operator);
    if (params.order) queryParams.append('order', params.order);
    if (params.direction) queryParams.append('direction', params.direction);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/quests${queryString}`, {
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch quests');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching quests:', error);
        throw error;
    }
};

export const fetchQuestById = async (id) => {
    console.log(`Fetching quest with ID: ${id}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/quests/${id}`, {
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch quest ${id}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching quest ${id}:`, error);
        throw error;
    }
};

export const createQuest = async (questData) => {
    console.log('Creating new quest:', questData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/quests`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(questData),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to create quest');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating quest:', error);
        throw error;
    }
};

export const updateQuest = async (id, questData) => {
    console.log(`Updating quest ${id}:`, questData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/quests/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(questData),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to update quest ${id}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error updating quest ${id}:`, error);
        throw error;
    }
};

export const deleteQuest = async (id) => {
    console.log(`Deleting quest ${id}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/quests/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to delete quest ${id}`);
        }
        
        return { success: true };
    } catch (error) {
        console.error(`Error deleting quest ${id}:`, error);
        throw error;
    }
};

export const updateQuestStatus = async (id, status) => {
    console.log(`Updating quest ${id} status to: ${status}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/quests/${id}/status`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status }),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to update quest ${id} status`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error updating quest ${id} status:`, error);
        throw error;
    }
};

// --- Mementos ---
export const fetchMementos = async (params = {}) => {
    console.log('Fetching mementos with params:', params);
    
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params.key) queryParams.append('key', params.key);
    if (params.filter) queryParams.append('filter', params.filter);
    if (params.operator) queryParams.append('operator', params.operator);
    if (params.order) queryParams.append('order', params.order);
    if (params.direction) queryParams.append('direction', params.direction);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/mementos${queryString}`, {
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch mementos');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching mementos:', error);
        throw error;
    }
};

export const fetchMementoById = async (id) => {
    console.log(`Fetching memento with ID: ${id}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/mementos/${id}`, {
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch memento ${id}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching memento ${id}:`, error);
        throw error;
    }
};

export const createMemento = async (mementoData) => {
    console.log('Creating new memento:', mementoData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/mementos`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(mementoData),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to create memento');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating memento:', error);
        throw error;
    }
};

export const updateMemento = async (id, mementoData) => {
    console.log(`Updating memento ${id}:`, mementoData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/mementos/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(mementoData),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to update memento ${id}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error updating memento ${id}:`, error);
        throw error;
    }
};

export const deleteMemento = async (id) => {
    console.log(`Deleting memento ${id}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/mementos/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to delete memento ${id}`);
        }
        
        return { success: true };
    } catch (error) {
        console.error(`Error deleting memento ${id}:`, error);
        throw error;
    }
};
