import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { search_order } from "../api/orders";
import { search_prod } from "../api/products";
import { search_users } from "../api/users";
import Footer from '../components/Footer';
import Orders from "../components/Orders";
import Products from "../components/Products";
import Users from "../components/Users";
import Aprove from "../components/AprovSellerUser";
import AsideFilter from "../components/tienda/AsideFilter/AsideFilter";
import { Container, Card, Tabs, Tab, Box, TextField } from '@mui/material';

const AdminPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [search, setSearch] = useState("");

  const { data } = useQuery({
    queryKey: ["products", search],
    queryFn: () => {
      if (search && selectedTab === 1) {
        return search_prod(search);
      }
      return { products: [] };
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users", search],
    queryFn: () => {
      if (search && selectedTab === 3) {
        return search_users(search);
      }
      return { users: [] };
    },
  });

  const { data: orders } = useQuery({
    queryKey: ["orders", search],
    queryFn: () => {
      if (search && selectedTab === 2) {
        return search_order(search);
      }
      return { orders: [] };
    },
  });

  return (
    <>
      <section style={{ minHeight: '80vh' }} className="dark:bg-gray-900 mt-24">
        <Container maxWidth="lg" sx={{ mb: 10 }}>
          <div className="mb-4">
            <h4 className='card-name-light'>Gestión administrativa</h4>
            <h6 className='card-subname-light'>Gestiona productos, ordenes e incluso usuarios</h6>
          </div>
          <Card sx={{ p: 4, bgcolor: 'white', darkMode: { bgcolor: 'gray.800' }, boxShadow: 3, borderRadius: 2 }}>
            
            <Tabs
              value={selectedTab}
              onChange={(e, newValue) => setSelectedTab(newValue)}
              indicatorColor="primary"
              textColor="primary"
              sx={{
                mb: 3,
                '& .Mui-selected': { color: '#39A900' },
                '& .MuiTabs-indicator': { backgroundColor: '#39A900' },
              }}
            >
              <Tab className="focus:outline-none" sx={{
                '&.Mui-selected': { color: '#39A900' },
              }} label="Solicitudes Vendedor" />
              <Tab className="focus:outline-none" sx={{
                '&.Mui-selected': { color: '#39A900' },
              }} label="Productos" />
              <Tab className="focus:outline-none" sx={{
                '&.Mui-selected': { color: '#39A900' },
              }} label="Ordenes" />
              <Tab className="focus:outline-none" sx={{
                '&.Mui-selected': { color: '#39A900' },
              }} label="Usuarios" />
            </Tabs>


            <Box>
              {selectedTab === 0 && <Aprove results={data} />}
              {selectedTab === 1 && <Products results={data} />}
              {selectedTab === 2 && <Orders results={orders} />}
              {selectedTab === 3 && <Users results={users} />}
            </Box>
          </Card>
        </Container>

        <AsideFilter />
      </section>
      <Footer />
    </>
  );
};

export default AdminPage;
