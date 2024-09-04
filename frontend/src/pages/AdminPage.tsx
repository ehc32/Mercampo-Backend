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
          <Card sx={{ p: 4, bgcolor: 'white', darkMode: { bgcolor: 'gray.800' }, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ mb: 3 }}>
              <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                variant="outlined"
                placeholder="Buscar"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <Box sx={{ ml: 1 }}>
                      
                    </Box>
                  ),
                }}
                sx={{
                  bgcolor: 'white',
                  borderColor: '#39A900',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#39A900',
                    },
                    '&:hover fieldset': {
                      borderColor: '#39A900',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#39A900',
                    },
                  },
                }}
              />
            </Box>
            <Tabs
              value={selectedTab}
              onChange={(e, newValue) => setSelectedTab(newValue)}
              indicatorColor="primary"
              textColor="primary"
              sx={{ mb: 3 }}
            >
              <Tab className="focus:outline-none" label="Solicitudes Vendedor" />
              <Tab className="focus:outline-none" label="Productos" />
              <Tab className="focus:outline-none" label="Ordenes" />
              <Tab className="focus:outline-none" label="Usuarios" />
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
