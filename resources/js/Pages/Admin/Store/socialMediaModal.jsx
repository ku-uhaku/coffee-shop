import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { z } from 'zod';
import { FaTrash } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { IoSave } from 'react-icons/io5';
import { useForm, router } from '@inertiajs/react';
import axios from 'axios';

const socialMediaLinkSchema = z.object({
  name: z.string().min(1, "Name is required"),
  link: z.string().url("Invalid URL").min(1, "Link is required"),
});

const SocialMediaModal = ({ isOpen, onClose, onAdd, storeId }) => {
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
  const [errors, setErrors] = useState([]);

  const { data, setData, post, processing, errors: formErrors } = useForm({
    storeId: storeId,
    socialMediaLinks: [],
  });

  useEffect(() => {
    if (isOpen) {
      fetchSocialMediaLinks();
    }
  }, [isOpen]);

  useEffect(() => {
    const lastLink = socialMediaLinks[socialMediaLinks.length - 1];
    setIsAddButtonDisabled(!(lastLink && lastLink.name && lastLink.link));
  }, [socialMediaLinks]);

  const fetchSocialMediaLinks = async () => {
    try {
      const response = await axios.get(route('admin.store.getSocialMediaLinks'));
      setSocialMediaLinks(response.data || [{ name: '', link: '' }]);
    } catch (error) {
      console.error('Error fetching social media links:', error);
      setSocialMediaLinks([{ name: '', link: '' }]);
    }
  };

  const handleAddLink = () => {
    setSocialMediaLinks([...socialMediaLinks, { name: '', link: '' }]);
  };

  const handleChange = (index, field, value) => {
    const updatedLinks = socialMediaLinks.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    );
    setSocialMediaLinks(updatedLinks);
  };

  const handleSubmit = () => {
    setErrors([]);

    const validationResults = socialMediaLinks.map(link => socialMediaLinkSchema.safeParse(link));

    const newErrors = validationResults
      .map((result, index) => {
        if (!result.success) {
          return { index, errors: result.error.errors };
        }
        return null;
      })
      .filter(Boolean);

    if (newErrors.length === 0) {
      setData('socialMediaLinks', socialMediaLinks);
      router.post(route('admin.store.updateSocialMediaLinks'),
        { socialMediaLinks: socialMediaLinks },
        {
          headers: {
            "Content-Type": "application/json",
          },
          preserveState: true,
          preserveScroll: true,
          onSuccess: () => {
            onAdd(socialMediaLinks);
            onClose();
          },
        }
      );
    } else {
      setErrors(newErrors);
    }
  };

  const handleDeleteRow = (index) => {
    setSocialMediaLinks(socialMediaLinks.filter((_, i) => i !== index));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Social Media Links"
      width="max-w-4xl"
      footer={
        <div className="flex justify-end gap-3 items-center w-full">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-300 flex items-center"
          >
            <IoMdClose className="mr-2" /> Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 flex items-center"
          >
            <IoSave className="mr-2" /> Save Links
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {socialMediaLinks.map((link, index) => (
          <div key={index} className={`p-4 rounded-lg shadow-sm ${index % 2 === 0 ? 'bg-slate-100' : 'bg-white'}`}>
            <div className="flex items-start mb-4">
              {socialMediaLinks.length > 1 && (
                <button
                  onClick={() => handleDeleteRow(index)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 mr-4"
                  aria-label="Remove"
                >
                  <FaTrash />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow items-end">
                <div>
                  <InputLabel htmlFor={`name-${index}`} value="Name" required />
                  <TextInput
                    id={`name-${index}`}
                    type="text"
                    value={link.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    className="mt-1 block w-full"
                    required
                  />
                  {errors.find(error => error.index === index)?.errors.find(err => err.path[0] === 'name') && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.find(error => error.index === index).errors.find(err => err.path[0] === 'name').message}
                    </p>
                  )}
                </div>
                <div>
                  <InputLabel htmlFor={`link-${index}`} value="Link" required />
                  <TextInput
                    id={`link-${index}`}
                    type="url"
                    value={link.link}
                    onChange={(e) => handleChange(index, 'link', e.target.value)}
                    className="mt-1 block w-full"
                    required
                  />
                  {errors.find(error => error.index === index)?.errors.find(err => err.path[0] === 'link') && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.find(error => error.index === index).errors.find(err => err.path[0] === 'link').message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-center">
          <button
            onClick={handleAddLink}
            className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 flex items-center ${isAddButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isAddButtonDisabled}
          >
            Add Another Link
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SocialMediaModal;