import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AsideEnterprise from "../components/enterprise/asideEnterprise";
import ContentEnterprise from "../components/enterprise/content";
import { getEnterpriseByUser } from '../api/users';

const Enterprise = () => {
  const { id } = useParams<{ id: string }>();
  const [enterpriseData, setEnterpriseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnterpriseData = async () => {
      if (!id) {
        setError('No user ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getEnterpriseByUser(id);
        setEnterpriseData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch enterprise data');
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchEnterpriseData();
  }, [id]);

  if (isLoading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Error: {error}</div>;
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'row', 
      height: '100vh', 
      overflow: 'hidden',
      width: '100vw', // Ocupa todo el ancho de la ventana
      margin: 0, // Elimina márgenes por defecto
      padding: 0 // Elimina paddings por defecto
    }}>
      {/* Aside - Ocupa solo el espacio necesario */}
      <div style={{ 
        width: 'auto', // Ancho fijo para el aside
        minWidth: '400px', // Evita que se encoja
        height: '100%',
        overflowY: 'auto' // Scroll si el contenido es muy largo
      }}>
        <AsideEnterprise enterpriseData={enterpriseData} />
      </div>
      
      {/* Contenido principal - Ocupa todo el espacio restante */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        minWidth: 0 // Permite que el contenido se ajuste
      }}>
        <ContentEnterprise enterpriseId={enterpriseData.enterprise.owner_user} />
      </div>
    </div>
  );
};

export default Enterprise;