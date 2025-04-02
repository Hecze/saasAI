// ...existing code...

/**
 * Get the storyboard cards for a specific project and version
 * @param {string} projectId - ID of the project
 * @param {string} versionId - ID of the version
 * @returns {Promise} - Promise that resolves with the cards data
 */
export const getStoryboardCards = async (projectId, versionId) => {
  try {
    const response = await fetch(`/api/projects/${projectId}/versions/${versionId}/cards`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get cards: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting storyboard cards:', error);
    throw error;
  }
};

/**
 * Updates the storyboard cards for a specific project and version
 * @param {string} projectId - ID of the project
 * @param {string} versionId - ID of the version
 * @param {Array} cards - Array of card objects to save
 * @returns {Promise} - Promise that resolves when cards are saved
 */
export const updateStoryboardCards = async (projectId, versionId, cards) => {
  try {
    const response = await fetch(`/api/projects/${projectId}/versions/${versionId}/cards`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cards }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update cards: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating storyboard cards:', error);
    throw error;
  }
};

// ...existing code...
