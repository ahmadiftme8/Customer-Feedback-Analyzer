
//D:\FrontEnd\Customer-Feedback-Analyzer\customer-feedback-analyzer\js\feedback.js


import { db, auth, HUGGING_FACE_API_KEY, HUGGING_FACE_API_URL } from './config.js';
import { collection, addDoc } from "firebase/firestore";

// Character counter for feedback textarea
document.getElementById('feedback').addEventListener('input', function(e) {
    const charCount = e.target.value.length;
    document.getElementById('charCount').textContent = charCount;
});

// Submit feedback
async function submitFeedback(event) {
    event.preventDefault();

    const feedbackText = document.getElementById('feedback').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const submitButton = event.target.querySelector('button[type="submit"]');

    try {
        // Disable submit button while processing
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';

        // Analyze sentiment using Hugging Face API
        const sentimentResponse = await analyzeSentiment(feedbackText);
        
        // Save feedback to Firestore
        await addDoc(collection(db, 'feedback'), {
            text: feedbackText,
            rating: parseInt(rating),
            sentiment: sentimentResponse.sentiment,
            keywords: sentimentResponse.keywords,
            timestamp: new Date('2025-03-09').toISOString(), // Using the specified date
            userId: auth.currentUser.uid
        });

        // Show success message
        successMessage.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        event.target.reset();
        document.getElementById('charCount').textContent = '0';

        // Hide success message after 3 seconds
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 3000);
    } catch (error) {
        console.error('Error submitting feedback:', error);
        errorMessage.textContent = 'Error submitting feedback. Please try again.';
        errorMessage.classList.remove('hidden');
        successMessage.classList.add('hidden');
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Feedback';
    }
}

// Analyze sentiment using Hugging Face API
async function analyzeSentiment(text) {
    try {
        const response = await fetch(HUGGING_FACE_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: text,
                options: {
                    wait_for_model: true
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to analyze sentiment');
        }

        const data = await response.json();
        
        // Extract sentiment from Hugging Face response
        // The model returns an array of predictions, we take the first one
        const prediction = data[0];
        const sentimentScore = prediction[0].score; // Score for positive sentiment
        
        return {
            sentiment: {
                score: sentimentScore,
                magnitude: Math.abs(sentimentScore),
                category: getSentimentCategory(sentimentScore)
            },
            keywords: extractKeywords(text)
        };
    } catch (error) {
        console.error('Error analyzing sentiment:', error);
        throw error;
    }
}

// Get sentiment category based on score
function getSentimentCategory(score) {
    if (score > 0.6) return 'positive';
    if (score < 0.4) return 'negative';
    return 'neutral';
}

// Simple keyword extraction
function extractKeywords(text) {
    // Remove common words and punctuation, split into words
    const words = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3)
        .filter(word => !['this', 'that', 'these', 'those', 'with', 'from'].includes(word));
    
    // Count word frequency
    const wordCount = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Sort by frequency and return top 5 keywords
    return Object.entries(wordCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([word]) => word);
}

// Export function for use in HTML
window.submitFeedback = submitFeedback; 