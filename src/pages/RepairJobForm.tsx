import React, { useState } from 'react';
import { RepairJob } from '../types/repairJob';
import { db, storage } from '../api/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const RepairJobForm = () => {
  const [jobData, setJobData] = useState<Partial<RepairJob>>({
    deviceBrand: '',
    deviceModel: '',
    // ... baaki fields
    status: 'pending',
    estimatedCost: 0,
  });
  const [devicePhotos, setDevicePhotos] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDevicePhotos(Array.from(e.target.files));
    }
  };

  const uploadImagesAndGetUrls = async (jobId: string) => {
    const urls: string[] = [];
    for (const file of devicePhotos) {
      const storageRef = ref(storage, `repair-photos/${jobId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 1. Customer ko pehle database mein add/search karna hoga
    // (Iss simplified code mein hum maan lete hain ki customer ID mil gayi hai)
    const customerId = "EXAMPLE_CUST_ID_123"; 

    try {
      // 2. Repair Job ko Firestore mein add karna
      const newJobRef = await addDoc(collection(db, 'repairJobs'), {
        ...jobData,
        customerId,
        createdDate: Date.now(),
        photos: [], // Abhi ke liye empty
      });

      const jobId = newJobRef.id;

      // 3. Photos ko Firebase Storage mein upload karna
      const photoUrls = await uploadImagesAndGetUrls(jobId);

      // 4. Job document ko photo URLs se update karna
      // (Iss step ke liye ek alag 'updateDoc' function ki zarurat hogi)
      // await updateDoc(newJobRef, { photos: photoUrls });

      alert('Repair Job Created Successfully!');
      setJobData({ /* reset form */ });
    } catch (error) {
      console.error("Error creating repair job: ", error);
      alert('Failed to create job.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">New Repair Job</h2>

      {/* Customer Details & Device Fields yahan honge (Tailwind CSS ke saath) */}

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Upload Photos</label>
        <input type="file" multiple onChange={handleFileChange} />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Estimated Cost</label>
        <input type="number" value={jobData.estimatedCost} 
               onChange={(e) => setJobData({...jobData, estimatedCost: parseFloat(e.target.value)})}
               className="shadow border rounded w-full py-2 px-3 text-gray-700" />
      </div>

      <button type="submit" disabled={isLoading} 
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50">
        {isLoading ? 'Creating...' : 'Submit Job'}
      </button>
    </form>
  );
};

export default RepairJobForm;
