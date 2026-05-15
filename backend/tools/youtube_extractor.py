from youtube_transcript_api import YouTubeTranscriptApi
import re

def extract_youtube_transcript(video_url: str) -> str:
    """
    Extracts the English transcript from a YouTube video URL.
    Returns the transcript as a single string.
    """
    # Regex to extract video ID from various YouTube URL formats
    video_id_match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", video_url)
    if not video_id_match:
        raise ValueError("Invalid YouTube URL")
        
    video_id = video_id_match.group(1)
    
    try:
        api = YouTubeTranscriptApi()
        transcript = api.fetch(video_id, languages=['en'])
        # Join all snippet texts into a single string
        text_formatted = " ".join(snippet.text for snippet in transcript)
        return text_formatted
    except Exception as e:
        return f"Error extracting transcript: {str(e)}"
