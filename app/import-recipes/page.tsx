'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import yaml from 'js-yaml';

export default function ImportRecipesPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [targetUser, setTargetUser] = useState('default');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!fileContent) {
      setError('Please upload a file first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResults(null);

    try {
      // Parse YAML file
      let recipes: any;
      
      try {
        recipes = yaml.load(fileContent);
      } catch (yamlError) {
        throw new Error('Failed to parse YAML file. Make sure it\'s a valid YAML format.');
      }

      // Handle different YAML structures
      let recipesArray = recipes;
      if (recipes.recipes) {
        recipesArray = recipes.recipes;
      } else if (!Array.isArray(recipes)) {
        recipesArray = [recipes];
      }

      console.log(`Parsed ${recipesArray.length} recipes from YAML`);

      // Send to import API
      const response = await fetch('/api/import-cookbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipes: recipesArray,
          targetUser: targetUser
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Import failed');
      }

      setResults(data);

    } catch (err: any) {
      console.error('Import error:', err);
      setError(err.message || 'Failed to import recipes');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-athiti font-bold text-gray-900 mb-2">
            Import Recipes from CookBook
          </h1>
          <p className="text-lg text-gray-600 font-athiti">
            Upload your CookBook YAML export file to import recipes
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          {/* User Selection */}
          <div className="mb-6">
            <label className="block text-sm font-athiti font-medium text-gray-700 mb-2">
              Import to User:
            </label>
            <select
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-athiti focus:ring-2 focus:ring-meal-green focus:outline-none"
            >
              <option value="default">Default User</option>
              <option value="demo">Demo User</option>
            </select>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-athiti font-medium text-gray-700 mb-2">
              Upload YAML File:
            </label>
            <input
              type="file"
              accept=".yaml,.yml"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-athiti focus:ring-2 focus:ring-meal-green focus:outline-none"
            />
            {fileContent && (
              <p className="mt-2 text-sm text-green-600 font-athiti">
                ✓ File loaded ({fileContent.length} characters)
              </p>
            )}
          </div>

          {/* Import Button */}
          <button
            onClick={handleImport}
            disabled={isProcessing || !fileContent}
            className="w-full bg-meal-green-light text-black px-6 py-3 rounded-lg font-athiti text-lg hover:bg-meal-green-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Importing...' : 'Import Recipes'}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-athiti">{error}</p>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="mt-6 space-y-4">
              {/* Success Summary */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-athiti font-bold text-green-800 mb-2">
                  Import Complete! 🎉
                </h3>
                <div className="space-y-1 font-athiti text-green-700">
                  <p>✅ Successfully imported: <strong>{results.success}</strong> recipes</p>
                  {results.failed > 0 && (
                    <p>⚠️ Failed/Skipped: <strong>{results.failed}</strong> recipes</p>
                  )}
                </div>
              </div>

              {/* Imported Recipes */}
              {results.imported && results.imported.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-athiti font-bold text-blue-800 mb-2">
                    Imported Recipes:
                  </h4>
                  <ul className="space-y-1 font-athiti text-blue-700 max-h-48 overflow-y-auto">
                    {results.imported.map((meal: any, idx: number) => (
                      <li key={idx}>• {meal.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Errors */}
              {results.errors && results.errors.length > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-athiti font-bold text-yellow-800 mb-2">
                    Warnings/Errors:
                  </h4>
                  <ul className="space-y-1 font-athiti text-yellow-700 text-sm max-h-48 overflow-y-auto">
                    {results.errors.map((err: string, idx: number) => (
                      <li key={idx}>• {err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* View Meals Button */}
              <button
                onClick={() => router.push('/meals')}
                className="w-full bg-meal-green text-white px-6 py-3 rounded-lg font-athiti text-lg hover:bg-meal-green-dark transition-colors duration-200"
              >
                View Your Meals
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-athiti font-bold text-gray-900 mb-4">
            📝 How to Export from CookBook:
          </h3>
          <ol className="space-y-2 font-athiti text-gray-700">
            <li>1. Open CookBook app or web app (cookbookmanager.com)</li>
            <li>2. Go to <strong>Settings → Export</strong></li>
            <li>3. Choose <strong>YAML format</strong></li>
            <li>4. Download the export file</li>
            <li>5. Upload it here to import to MealCreator!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}


