import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Divider,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'

import { useAppDispatch, useAppSelector } from '../app/hooks.js'
import { logout } from '../features/auth/authSlice.js'
import { clearCategoryError, createCategory, fetchCategories } from '../features/categories/categorySlice.js'
import {
  clearInventoryError,
  createInventoryItem,
  fetchInventory,
  setInventoryQuery,
} from '../features/inventory/inventorySlice.js'

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))

const emptyItemForm = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
}

export function DashboardView() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const categoriesState = useAppSelector((state) => state.categories)
  const inventoryState = useAppSelector((state) => state.inventory)
  const categories = categoriesState.items
  const items = inventoryState.items
  const query = inventoryState.query
  const pagination = inventoryState.pagination
  const [categoryName, setCategoryName] = useState('')
  const [itemForm, setItemForm] = useState(emptyItemForm)
  const selectedCategoryId = itemForm.categoryId || categories[0]?.id || ''

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchInventory())
  }, [dispatch, query.categoryId, query.limit, query.page, query.search])

  const handleCategorySubmit = async (event) => {
    event.preventDefault()

    try {
      await dispatch(createCategory({ name: categoryName })).unwrap()
      setCategoryName('')
    } catch {
      return
    }
  }

  const handleItemFieldChange = (field) => (event) => {
    const { value } = event.target
    setItemForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleInventorySubmit = async (event) => {
    event.preventDefault()

    try {
      await dispatch(
        createInventoryItem({
          ...itemForm,
          categoryId: selectedCategoryId,
          price: Number(itemForm.price),
        }),
      ).unwrap()

      setItemForm({
        ...emptyItemForm,
        categoryId: selectedCategoryId,
      })
      dispatch(fetchInventory())
      dispatch(fetchCategories())
    } catch {
      return
    }
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      <Stack spacing={3}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4">Inventory Management</Typography>
            <Typography color="text.secondary">
              Signed in as {user?.name}
            </Typography>
          </Box>
          <Button variant="outlined" onClick={() => dispatch(logout())}>
            Logout
          </Button>
        </Box>

        <Paper sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Total items: {pagination.totalItems} | Categories: {categories.length}
          </Typography>
        </Paper>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', xl: '340px minmax(0, 1fr)' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="h5">Categories</Typography>
                  <Typography color="text.secondary">
                    Create unique category names and use them as item filters.
                  </Typography>
                </Box>

                {categoriesState.error ? (
                  <Alert severity="error" onClose={() => dispatch(clearCategoryError())}>
                    {categoriesState.error}
                  </Alert>
                ) : null}

                <Box component="form" onSubmit={handleCategorySubmit}>
                  <Stack spacing={1.5}>
                    <TextField
                      label="New category"
                      value={categoryName}
                      onChange={(event) => setCategoryName(event.target.value)}
                      required
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={categoriesState.createStatus === 'loading'}
                    >
                      {categoriesState.createStatus === 'loading' ? 'Saving...' : 'Create category'}
                    </Button>
                  </Stack>
                </Box>

                <Divider />

                <Stack spacing={1.25}>
                  <Button
                    onClick={() =>
                      dispatch(
                        setInventoryQuery({
                          categoryId: 'all',
                          page: 1,
                        }),
                      )
                    }
                    variant={query.categoryId === 'all' ? 'contained' : 'outlined'}
                    sx={{ justifyContent: 'space-between' }}
                  >
                    All categories
                  </Button>

                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      onClick={() =>
                        dispatch(
                          setInventoryQuery({
                            categoryId: category.id,
                            page: 1,
                        }),
                      )
                    }
                      variant={query.categoryId === category.id ? 'contained' : 'outlined'}
                      sx={{ justifyContent: 'space-between' }}
                    >
                      {category.name} ({category.itemCount})
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          </Stack>

          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="h5">Create inventory item</Typography>
                  <Typography color="text.secondary">
                    Add an item with a category, description, and unit price.
                  </Typography>
                </Box>

                {inventoryState.error ? (
                  <Alert severity="error" onClose={() => dispatch(clearInventoryError())}>
                    {inventoryState.error}
                  </Alert>
                ) : null}

                <Box component="form" onSubmit={handleInventorySubmit}>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' },
                        gap: 2,
                      }}
                    >
                      <TextField
                        label="Item name"
                        value={itemForm.name}
                        onChange={handleItemFieldChange('name')}
                        required
                      />
                      <TextField
                        select
                        label="Category"
                        value={selectedCategoryId}
                        onChange={handleItemFieldChange('categoryId')}
                        required
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>

                    <TextField
                      multiline
                      minRows={3}
                      label="Description"
                      value={itemForm.description}
                      onChange={handleItemFieldChange('description')}
                    />

                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '0.6fr auto' },
                        gap: 2,
                        alignItems: 'center',
                      }}
                    >
                      <TextField
                        type="number"
                        label="Price"
                        inputProps={{ min: 0, step: 0.01 }}
                        value={itemForm.price}
                        onChange={handleItemFieldChange('price')}
                        required
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={
                          inventoryState.createStatus === 'loading' || categories.length === 0
                        }
                      >
                        {inventoryState.createStatus === 'loading' ? 'Saving...' : 'Add item'}
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3, overflow: 'hidden' }}>
              <Stack spacing={2.5}>
                <Stack
                  direction={{ xs: 'column', lg: 'row' }}
                  spacing={2}
                  justifyContent="space-between"
                  alignItems={{ xs: 'stretch', lg: 'center' }}
                >
                  <Box>
                    <Typography variant="h5">Inventory list</Typography>
                    <Typography color="text.secondary">
                      Search by name or description, then narrow by category.
                    </Typography>
                  </Box>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                    <TextField
                      label="Search items"
                      value={query.search}
                      onChange={(event) =>
                        dispatch(
                          setInventoryQuery({
                            search: event.target.value,
                            page: 1,
                          }),
                        )
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      select
                      label="Filter category"
                      value={query.categoryId}
                      onChange={(event) =>
                        dispatch(
                          setInventoryQuery({
                            categoryId: event.target.value,
                            page: 1,
                          }),
                        )
                      }
                      sx={{ minWidth: 220 }}
                    >
                      <MenuItem value="all">All categories</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                </Stack>

                {inventoryState.status === 'loading' ? <LinearProgress /> : null}

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell>Added</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.length > 0 ? (
                        items.map((item) => (
                          <TableRow key={item.id} hover>
                            <TableCell>
                              <Stack spacing={0.5}>
                                <Typography fontWeight={700}>{item.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {item.description || 'No description provided.'}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>{item.category?.name ?? 'Uncategorized'}</TableCell>
                            <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                            <TableCell>{formatDate(item.createdAt)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4}>
                            <Typography sx={{ py: 3 }} color="text.secondary">
                              No inventory items found.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                >
                  <Typography color="text.secondary">
                    Page {pagination.page} of {pagination.totalPages}
                  </Typography>

                  <Pagination
                    color="primary"
                    page={pagination.page}
                    count={pagination.totalPages}
                    onChange={(_event, page) =>
                      dispatch(
                        setInventoryQuery({
                          page,
                        }),
                      )
                    }
                  />
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
