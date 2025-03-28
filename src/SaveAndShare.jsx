import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { FaDownload, FaLink, FaTwitter, FaDiscord, FaReddit } from 'react-icons/fa';

const SaveAndShare = ({ wardMapRef, playerInfo }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [copying, setCopying] = useState(false);
  const [saving, setSaving] = useState(false);
  const linkInputRef = useRef(null);

  // Generate a shareable URL with query parameters
  const generateShareableUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.append('accountId', playerInfo.accountId || '');
    params.append('games', playerInfo.numGames || '100');
    params.append('team', playerInfo.isRadiant || 'all');
    params.append('shared', 'true');
    
    return `${baseUrl}?${params.toString()}`;
  };

  // Copy the shareable link to clipboard
  const copyLinkToClipboard = async () => {
    const url = generateShareableUrl();
    setShareUrl(url);
    setCopying(true);
    
    try {
      await navigator.clipboard.writeText(url);
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      setCopying(false);
    }
  };

  // Save the heatmap as an image
  const saveAsImage = async () => {
    if (!wardMapRef.current) return;
    
    setSaving(true);
    try {
      const canvas = await html2canvas(wardMapRef.current, {
        backgroundColor: null,
        scale: 2, // Higher resolution
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `dota-wards-${playerInfo.accountId}-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    } catch (err) {
      console.error('Error saving image:', err);
    } finally {
      setSaving(false);
    }
  };

  // Share to social media
  const shareToSocial = (platform) => {
    const url = encodeURIComponent(generateShareableUrl());
    const text = encodeURIComponent(`Check out my Dota 2 ward placement heatmap!`);
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'reddit':
        shareUrl = `https://www.reddit.com/submit?url=${url}&title=${text}`;
        break;
      case 'discord':
        // Discord doesn't have a direct share URL, so we'll just copy the link
        copyLinkToClipboard();
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Save & Share</h3>
      
      <div className="space-y-4">
        {/* Save as image button */}
        <button
          onClick={saveAsImage}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaDownload />
          {saving ? 'Saving...' : 'Save as Image'}
        </button>
        
        {/* Copy link button */}
        <div className="relative">
          <button
            onClick={copyLinkToClipboard}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 border border-gray-300"
          >
            <FaLink />
            {copying ? 'Copied!' : 'Copy Shareable Link'}
          </button>
          
          {shareUrl && (
            <div className="mt-2">
              <input
                ref={linkInputRef}
                type="text"
                value={shareUrl}
                readOnly
                className="w-full p-2 text-sm bg-gray-50 border border-gray-300 rounded"
              />
            </div>
          )}
        </div>
        
        {/* Social media sharing */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => shareToSocial('twitter')}
            className="p-2 text-blue-500 hover:text-blue-700"
            title="Share on Twitter"
          >
            <FaTwitter size={24} />
          </button>
          <button
            onClick={() => shareToSocial('reddit')}
            className="p-2 text-orange-500 hover:text-orange-700"
            title="Share on Reddit"
          >
            <FaReddit size={24} />
          </button>
          <button
            onClick={() => shareToSocial('discord')}
            className="p-2 text-indigo-500 hover:text-indigo-700"
            title="Copy for Discord"
          >
            <FaDiscord size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveAndShare;