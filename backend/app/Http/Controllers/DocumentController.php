<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class DocumentController extends Controller
{
    public function index()
    {
        return response()->json(Document::with('user')->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf|max:10240', // Max 10MB PDF
        ]);

        $path = $request->file('file')->store('documents', 'local');

        $doc = Document::create([
            'name' => $request->name,
            'file_path' => $path,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($doc->load('user'), 201);
    }

    public function show(Document $document)
    {
        if (!Storage::disk('local')->exists($document->file_path)) {
            return response()->json(['message' => 'File not found on disk'], 404);
        }

        return Storage::disk('local')->download($document->file_path, $document->name . '.pdf');
    }

    public function destroy(Document $document)
    {
        if (Storage::disk('local')->exists($document->file_path)) {
            Storage::disk('local')->delete($document->file_path);
        }
        $document->delete();
        
        return response()->json(null, 204);
    }
}
