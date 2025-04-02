import React, { useState, useEffect, useRef } from 'react';
import { updateStoryboardCards, getStoryboardCards } from '../../services/storyboardService';
import { toast } from 'react-toastify';

function StoryBuilder({ project, version, onSave, ...props }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const previousVersion = useRef(null);
  const previousProject = useRef(null);

  // Load cards for the current version
  const loadCards = async () => {
    if (!project?.id || !version?.id) return;

    try {
      setLoading(true);

      // First check local storage for unsaved changes
      const localStorageKey = `storyboard-cards-${project.id}-${version.id}`;
      const localData = localStorage.getItem(localStorageKey);

      if (localData) {
        const parsedData = JSON.parse(localData);
        setCards(parsedData);
        setHasUnsavedChanges(true);
        toast.info("Loaded unsaved changes");
        setLoading(false);
      } else {
        // Fetch from API if no local changes
        const fetchedCards = await getStoryboardCards(project.id, version.id);
        setCards(fetchedCards);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading cards:", error);
      toast.error("Failed to load cards");
      setLoading(false);
    }
  };

  // Save card data to API and clear local storage
  const saveCardData = async () => {
    if (!project?.id || !version?.id || cards.length === 0) return;

    try {
      setLoading(true);
      await updateStoryboardCards(project.id, version.id, cards);

      // Clear local storage after successful save
      const localStorageKey = `storyboard-cards-${project.id}-${version.id}`;
      localStorage.removeItem(localStorageKey);

      setHasUnsavedChanges(false);
      setLoading(false);
      toast.success("Cards saved successfully");
    } catch (error) {
      setLoading(false);
      console.error("Error saving cards:", error);
      toast.error("Failed to save cards");
    }
  };

  // Handle card changes
  const handleCardChange = (updatedCards) => {
    setCards(updatedCards);
    setHasUnsavedChanges(true);

    // Save to local storage as backup
    if (project?.id && version?.id) {
      const localStorageKey = `storyboard-cards-${project.id}-${version.id}`;
      localStorage.setItem(localStorageKey, JSON.stringify(updatedCards));
    }
  };

  // Effect to handle version or project changes
  useEffect(() => {
    const handleVersionChange = async () => {
      // Save current data before switching if there are unsaved changes
      if (
        hasUnsavedChanges &&
        cards.length > 0 &&
        previousVersion.current &&
        previousProject.current &&
        (previousVersion.current !== version?.id || previousProject.current !== project?.id)
      ) {
        // Save to local storage before switching
        const prevLocalStorageKey = `storyboard-cards-${previousProject.current}-${previousVersion.current}`;
        localStorage.setItem(prevLocalStorageKey, JSON.stringify(cards));
        toast.info("Changes saved to local storage");
      }

      // Update references
      previousVersion.current = version?.id;
      previousProject.current = project?.id;

      // Load cards for new version
      await loadCards();
    };

    handleVersionChange();
  }, [version, project]);

  // Handle component unmount or navigation away
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        // Save to local storage before page unload
        const localStorageKey = `storyboard-cards-${project?.id}-${version?.id}`;
        localStorage.setItem(localStorageKey, JSON.stringify(cards));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Save to local storage when component unmounts if there are unsaved changes
      if (hasUnsavedChanges && project?.id && version?.id) {
        const localStorageKey = `storyboard-cards-${project.id}-${version.id}`;
        localStorage.setItem(localStorageKey, JSON.stringify(cards));
      }
    };
  }, [hasUnsavedChanges, cards, project, version]);

  // Update the save button onClick handler
  const handleSaveClick = () => {
    saveCardData();
    if (onSave) onSave(cards);
  };

  return (
    <div className="storybuilder-container">
      {/* Pass the handler to any card editor components */}
      <CardEditor
        cards={cards}
        onChange={handleCardChange}
        // ...other props
      />

      <div className="storybuilder-actions">
        <Button
          onClick={handleSaveClick}
          disabled={loading || !hasUnsavedChanges}
          className={`save-button ${hasUnsavedChanges ? 'has-changes' : ''}`}
        >
          {loading ? "Saving..." : hasUnsavedChanges ? "Save Changes*" : "Save Changes"}
        </Button>
      </div>

      {hasUnsavedChanges && (
        <div className="unsaved-changes-indicator">
          You have unsaved changes
        </div>
      )}
    </div>
  );
}

export default StoryBuilder;
