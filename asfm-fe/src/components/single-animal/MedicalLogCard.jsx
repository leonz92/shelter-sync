import CustomBadge from '@/components/custom/CustomBadge';
import { fetchMedicationItem } from '@/services/medicalLogCardService';
import { useState, useEffect } from 'react';

export default function MedicalLogCard({ log }) {
  const [item, setItem] = useState('');
  const logCategory = log?.category[0] + log?.category.slice(1).toLowerCase();
  const formattedDate = new Date(log.logged_at).toUTCString();

  useEffect(() => {
    async function load() {
      // This is broken, needs medical-log creation and BE services to be updated
      const itemData = await fetchMedicationItem(log.medication_id);
      if (!itemData) return setItem(null);
      setItem(itemData);
    }

    // don't run due to 404 errors
    // if (log.medication_id) {
    //   load();
    // }
  }, [log.medication_id]);

  return (
    <div className="ring-1 p-2 rounded-lg">
      <span className="text-lg font-semibold">Logged at: [ {formattedDate} ]</span>
      <CustomBadge text={logCategory} badgeClassName="ml-5 px-2 py-1" />
      <div className="pt-5">
        <span className="text-lg font-semibold">General Notes:</span>
        <span className="block pt-2">{log.general_notes ? log.general_notes : 'None'}</span>
      </div>
      <div className="pt-5">
        <span className="text-lg font-semibold">Behavioral Notes:</span>
        <span className="block pt-2">{log.behavior_notes ? log.behavior_notes : 'None'}</span>
      </div>
      <div className="pt-5">
        <span className="text-lg font-semibold">Medications:</span>
        {item ? (
          <span className="block pt-2">
            {item.name} {log.dose && `- Dosage: ${log.dose} dose`}{' '}
            {log.prescription && `- Prescription: ${log.prescription}`}{' '}
            {item.medication && `- Administration Route: ${item.medication.administration_route}`}
          </span>
        ) : (
          <span className="block pt-2">None</span>
        )}
      </div>
    </div>
  );
}
