import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Image as ImageIcon, Link as LinkIcon, X, Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Code } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { supabase } from '../supabaseClient';
import '../styles/editor.css';

const CreateBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; usn: string } | null>(null);
  const [isAuthor, setIsAuthor] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
          TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder: 'Write your blog content here...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const wordCount = editor.getText().trim().split(/\s+/).length;
      if (wordCount > 1500) {
        // Trim the content if it exceeds 1500 words
        const words = editor.getText().trim().split(/\s+/);
        const trimmedWords = words.slice(0, 1500);
        editor.commands.setContent(trimmedWords.join(' '));
      }
    },
  });

  const categories = [
    'Technology',
    'Current-Affairs',
    'Sports',
    'Entertainment',
    'Rumours',
    'IMP'
  ];

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('name, usn')
          .eq('id', user.id)
          .single();
        
        if (data && !error) {
          setUserInfo(data);
        }
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        const { data: blog, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (blog.author_id !== user.id) {
          navigate('/blogs');
          return;
        }

        setIsAuthor(true);
        setTitle(blog.title);
        setDescription(blog.description);
        setBannerUrl(blog.banner_url);
        setCategory(blog.category);
        editor?.commands.setContent(blog.content);
      } catch (error) {
        console.error('Error fetching blog:', error);
        navigate('/blogs');
      }
    };

    fetchBlogData();
  }, [id, editor]);

  const handleLinkInsert = () => {
    if (linkUrl && editor) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const handleImageInsert = () => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !editor?.getText().trim() || !bannerUrl || !category) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const content = editor.getHTML();

      if (isEditing) {
        // Update existing blog
        const { error: updateError } = await supabase
          .from('blogs')
          .update({
            title,
            description,
            content,
            banner_url: bannerUrl,
            category,
          })
          .eq('id', id);

        if (updateError) throw updateError;
      } else {
        // Create new blog
        const { error: insertError } = await supabase
          .from('blogs')
          .insert([
            {
              title,
              description,
              content,
              banner_url: bannerUrl,
              category,
              author_id: user.id,
              likes: 0
            }
          ]);

        if (insertError) throw insertError;

        const { error: updateError } = await supabase
          .from('users')
          .update({ reputation: 0 })
          .eq('id', user.id)
          .is('reputation', null);

        if (updateError) throw updateError;
      }

      navigate('/blogs');
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const MenuBar = () => {
    if (!editor) {
      return null;
    }

    return (
      <div className="border-b border-gray-300 p-2 flex flex-wrap gap-2 items-center">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100' : ''}`}
             title="Left align">
            <AlignLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100' : ''}`}
            title="Center align">
            <AlignCenter className="h-5 w-5" />
          </button>
          <button
             onClick={() => editor.chain().focus().setTextAlign('right').run()}
             className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100' : ''}`}
             title="Right align">
            <AlignRight className="h-5 w-5" />
          </button>
          <button
             onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-100' : ''}`}
            title="Justify">
            <AlignJustify className="h-5 w-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
          >
            <Bold className="h-5 w-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
          >
            <Italic className="h-5 w-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-100' : ''}`}
          >
            <Heading1 className="h-5 w-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''}`}
          >
            <Heading2 className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-100' : ''}`}
          >
            <List className="h-5 w-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-100' : ''}`}
          >
            <ListOrdered className="h-5 w-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-100' : ''}`}
          >
            <Quote className="h-5 w-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('codeBlock') ? 'bg-gray-100' : ''}`}
          >
            <Code className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-100' : ''}`}
          >
            <LinkIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleImageInsert}
            className="p-2 rounded hover:bg-gray-100"
          >
            <ImageIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditing ? 'Edit Blog' : 'Create Blog'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Banner Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Banner Image URL</label>
            <div className="flex items-center space-x-2">
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="Enter image URL"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {bannerUrl && (
                <button
                  type="button"
                  onClick={() => setBannerUrl('')}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            {bannerUrl && (
              <div className="mt-2 h-48 rounded-lg overflow-hidden">
                <img
                  src={bannerUrl}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a short description for your blog"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <span className="text-sm text-gray-500">
                {editor ? editor.getText().trim().split(/\s+/).length : 0}/1500 words
              </span>
            </div>
            <div className="border border-gray-300 rounded-lg">
              <MenuBar />
              {showLinkInput && (
                <div className="border-b border-gray-300 p-2 flex items-center space-x-2">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="Enter URL"
                    className="flex-1 rounded border border-gray-300 px-3 py-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleLinkInsert}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Insert
                  </button>
                </div>
              )}
              <EditorContent 
                editor={editor} 
                className="prose max-w-none p-4 min-h-[400px] focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting 
                ? (isEditing ? 'Saving...' : 'Publishing...') 
                : (isEditing ? 'Save Changes' : 'Publish Blog')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog; 