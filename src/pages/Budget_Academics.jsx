// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import '../styles/pages/budget.css'
// import { Toaster, toast } from 'react-hot-toast'
// import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'

// export default function Budget_Academics() {
//     const [isLoading, setIsLoading] = useState(true)
//     const [budgets, setBudgets] = useState([])
//     const [categories, setCategories] = useState([])
//     const [modalOpen, setModalOpen] = useState(false)
//     const [editBudget, setEditBudget] = useState(null)

//     const [formData, setFormData] = useState({
//         category: '',
//         limit: '',
//         month: ''
//     })

//     const token = localStorage.getItem('token')

//     const slug = 'academics'

//     const fetchCategories = async () => {
//         try {
//             const res = await axios.get('https://fintrack-api-9u9p.onrender.com/api/categories')
//             setCategories(res.data)
//         } catch (err) {
//             toast.error(`Error loading categories: ${err.response?.data?.message || err.message}`)
//         }
//     }

//     const fetchBudgets = async () => {
//         try {
//             const res = await axios.get(
//                 `https://fintrack-api-9u9p.onrender.com/api/budgets/${slug}`,
//                 {
//                     headers: { Authorization: `Bearer ${token}` }
//                 }
//             )
//             setBudgets(res.data)
//         } catch (err) {
//             toast.error(`Error fetching academic budgets: ${err.response?.data?.message || err.message}`)
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     useEffect(() => {
//         fetchCategories()
//         fetchBudgets()
//     }, [])

//     const openEditModal = b => {
//         setEditBudget(b)
//         setFormData({
//             category: b.category,
//             limit: b.limit,
//             month: b.month
//         })
//         setModalOpen(true)
//     }

//     const handleChange = e => {
//         setFormData({ ...formData, [e.target.name]: e.target.value })
//     }

//     const handleSubmit = async e => {
//         e.preventDefault()

//         try {
//             if (editBudget) {
//                 await axios.put(
//                     `https://fintrack-api-9u9p.onrender.com/api/budgets/${slug}`,
//                     {
//                         ...formData,
//                         id: editBudget.id
//                     },
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                             'Content-Type': 'application/json'
//                         }
//                     }
//                 )
//                 toast.success('Budget updated')
//             } else {
//                 await axios.post(
//                     `https://fintrack-api-9u9p.onrender.com/api/budgets/${slug}`,
//                     formData,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                             'Content-Type': 'application/json'
//                         }
//                     }
//                 )
//                 toast.success('Budget added')
//             }

//             setModalOpen(false)
//             setEditBudget(null)
//             setFormData({ category: '', limit: '', month: '' })
//             fetchBudgets()
//         } catch (err) {
//             const msg = err.response?.data?.message || 'Error saving budget'
//             toast.error(msg)
//         }
//     }

//     const handleDelete = async id => {
//         try {
//             await axios.delete(
//                 `https://fintrack-api-9u9p.onrender.com/api/budgets/${slug}/${id}`,
//                 {
//                     headers: { Authorization: `Bearer ${token}` }
//                 }
//             )
//             toast.success('Budget deleted')
//             fetchBudgets()
//         } catch (err) {
//             toast.error(`Error deleting budget: ${err.response?.data?.message || err.message}`)
//         }
//     }

//     return (
//         <main className="budget-page">
//             <Toaster />

//             <div className="budget-head">
//                 <h1>Academic Budget</h1>
//                 <button className="btn-blue" onClick={() => setModalOpen(true)}>
//                     Add Budget
//                 </button>
//             </div>

//             {isLoading ? (
//                 <p className="loading-text">Loading...</p>
//             ) : (
//                 <table className="budget-table">
//                     <thead>
//                         <tr>
//                             <th>Month</th>
//                             <th>Category</th>
//                             <th>Limit</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {budgets.length > 0 ? (
//                             budgets.map((b, i) => (
//                                 <tr key={i}>
//                                     <td>{b.month}</td>
//                                     <td>{b.category}</td>
//                                     <td>₦{b.limit}</td>
//                                     <td>
//                                         <button className="btn-edit" onClick={() => openEditModal(b)}>
//                                             <FaPencilAlt />
//                                         </button>
//                                         <button className="btn-edit" onClick={() => handleDelete(b.id)}>
//                                             <FaTrashAlt />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td id="NoBud" colSpan="4">No academic budgets yet</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             )}

//             {modalOpen && (
//                 <div className="budget-modal">
//                     <div className="budget-modal-content">
//                         <h2>{editBudget ? 'Edit Budget' : 'Create Budget'}</h2>

//                         <form onSubmit={handleSubmit}>
//                             {/* <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select category</option>

//                 {categories
//                   .filter(c =>
//                     c.name.includes('Academic') ||
//                     c.name.includes('Books') ||
//                     c.name.includes('Tuition') ||
//                     c.name.includes('Project')
//                   )
//                   .map(c => (
//                     <option key={c.id} value={c.name}>
//                       {c.name}
//                     </option>
//                   ))}
//               </select> */}

//                             <select
//                                 name="category"
//                                 value={formData.category}
//                                 onChange={handleChange}
//                                 required
//                             >
//                                 <option value="">Select category</option>

//                                 {categories
//                                     .filter(c =>
//                                         !(
//                                             c.name.includes('Academic') ||
//                                             c.name.includes('Books') ||
//                                             c.name.includes('Tuition') ||
//                                             c.name.includes('Project')
//                                         )
//                                     )
//                                     .map(c => (
//                                         <option key={c.id} value={c.name}>{c.name}</option>
//                                     ))}
//                             </select>

//                             <input
//                                 type="number"
//                                 name="limit"
//                                 placeholder="Limit"
//                                 value={formData.limit}
//                                 onChange={handleChange}
//                                 required
//                             />

//                             <input
//                                 type="month"
//                                 name="month"
//                                 value={formData.month}
//                                 onChange={handleChange}
//                                 required
//                             />

//                             <div className="modal-actions">
//                                 <button className="btn-blue" type="submit">
//                                     {editBudget ? 'Update' : 'Add'}
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="btn-blue"
//                                     onClick={() => {
//                                         setModalOpen(false)
//                                         setEditBudget(null)
//                                     }}
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </main>
//     )
// }

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/pages/budget.css'
import { Toaster, toast } from 'react-hot-toast'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
export default function Budget_Academics() {
    const [isLoading, setIsLoading] = useState(true)
    const [budgets, setBudgets] = useState([])
    const [categories, setCategories] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [editBudget, setEditBudget] = useState(null)
    const [formData, setFormData] = useState({
        category: '',
        limit: '',
        month: ''
    })
    const token = localStorage.getItem('token')
    const fetchCategories = async () => {
        try {
            const res = await axios.get(
                'https://fintrack-api-9u9p.onrender.com/api/categories',
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setCategories(res.data)
        } catch (err) {
            toast.error('Error loading categories')
        }
    }
    const fetchBudgets = async () => {
        try {
            const res = await axios.get(
                'https://fintrack-api-9u9p.onrender.com/api/budgets',
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setBudgets(res.data)
        } catch (err) {
            toast.error('Error fetching budgets')
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchCategories()
        fetchBudgets()
    }, [])
    const openEditModal = (b) => {
        setEditBudget(b)
        setFormData({
            category: b.slug,
            limit: b.limit,
            month: b.month
        })
        setModalOpen(true)
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const slug = formData.category

        try {
            if (editBudget) {
                await axios.put(
                    `https://fintrack-api-9u9p.onrender.com/api/budgets/${slug}/${editBudget.id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                )
                toast.success('Budget updated')
            } else {
                await axios.put(
                    `https://fintrack-api-9u9p.onrender.com/api/budgets/${slug}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                )
                toast.success('Budget added')
            }

            setModalOpen(false)
            setEditBudget(null)
            setFormData({ category: '', limit: '', month: '' })
            fetchBudgets()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving budget')
        }

    }
    const handleDelete = async (b) => {
        try {
            await axios.delete(
                `https://fintrack-api-9u9p.onrender.com/api/budgets/${b.slug}/${b.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            toast.success('Budget deleted')
            fetchBudgets()
        } catch (err) {
            toast.error('Error deleting budget')
        }

    }
    return (
        <main className="budget-page">
            <Toaster />
            <div className="budget-head">
                <h1>Academic Budget</h1>
                <button className="btn-blue" onClick={() => setModalOpen(true)}>
                    Add Budget
                </button>
            </div>

            {isLoading ? (
                <p className="loading-text">Loading...</p>
            ) : (
                <table className="budget-table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Category</th>
                            <th>Limit</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {budgets.length > 0 ? (
                            budgets.map((b, i) => (
                                <tr key={i}>
                                    <td>{b.month}</td>
                                    <td>{b.category}</td>
                                    <td>₦{b.limit}</td>
                                    <td>
                                        <button className="btn-edit" onClick={() => openEditModal(b)}>
                                            <FaPencilAlt />
                                        </button>
                                        <button className="btn-edit" onClick={() => handleDelete(b)}>
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td id="NoBud" colSpan="4">
                                    No academic budgets yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {modalOpen && (
                <div className="budget-modal">
                    <div className="budget-modal-content">
                        <h2>{editBudget ? 'Edit Budget' : 'Create Budget'}</h2>

                        <form onSubmit={handleSubmit}>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select category</option>

                                {categories
                                    .filter((c) =>
                                        c.name.includes('Academic') ||
                                        c.name.includes('Books') ||
                                        c.name.includes('Tuition') ||
                                        c.name.includes('Project')
                                    )
                                    .map((c) => (
                                        <option key={c.id} value={c.slug}>
                                            {c.name}
                                        </option>
                                    ))}
                            </select>

                            <input
                                type="number"
                                name="limit"
                                placeholder="Limit"
                                value={formData.limit}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="month"
                                name="month"
                                value={formData.month}
                                onChange={handleChange}
                                required
                            />

                            <div className="modal-actions">
                                <button className="btn-blue" type="submit">
                                    {editBudget ? 'Update' : 'Add'}
                                </button>
                                <button
                                    type="button"
                                    className="btn-blue"
                                    onClick={() => {
                                        setModalOpen(false)
                                        setEditBudget(null)
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>

    )
}

// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import '../styles/pages/budget.css'
// import { Toaster, toast } from 'react-hot-toast'
// import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'

// export default function Budget_Academics() {
//     const [isLoading, setIsLoading] = useState(true)
//     const [categories, setCategories] = useState([])
//     // const [modalOpen, setModalOpen] = useState(false)
//     const [editCategory, setEditCategory] = useState(null)
//     const [formData, setFormData] = useState({ name: '' })
//     const [modalOpen, setModalOpen] = useState(false);
//     const [editBudget, setEditBudget] = useState(null);
//     const token = localStorage.getItem('token')

//     // Fetch only academic categories
//     const fetchCategories = async () => {
//         try {
//             const res = await axios.get(
//                 'https://fintrack-api-9u9p.onrender.com/api/categories',
//                 { headers: { Authorization: `Bearer ${token}` } }
//             )
//             const academicCategories = res.data.filter(c =>
//                 c.name.includes('Academic') ||
//                 c.name.includes('Books') ||
//                 c.name.includes('Tuition') ||
//                 c.name.includes('Project')
//             )
//             setCategories(academicCategories)
//         } catch (err) {
//             toast.error(`Error loading categories: ${err.response?.data?.message || err.message}`)
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     useEffect(() => {
//         fetchCategories()
//     }, [])

//     const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

//     const handleSubmit = async e => {
//         e.preventDefault()
//         try {
//             if (editCategory) {
//                 // Update category
//                 await axios.put(
//                     `https://fintrack-api-9u9p.onrender.com/api/categories/${editCategory.id}`,
//                     formData,
//                     { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
//                 )
//                 toast.success('Category updated')
//             } else {
//                 // Add new category
//                 await axios.post(
//                     'https://fintrack-api-9u9p.onrender.com/api/categories',
//                     formData,
//                     { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
//                 )
//                 toast.success('Category added')
//             }
//             setModalOpen(false)
//             setEditCategory(null)
//             setFormData({ name: '' })
//             fetchCategories()
//         } catch (err) {
//             toast.error(err.response?.data?.message || err.message)
//         }
//     }

//     const handleDelete = async (slug) => {
//         try {
//             await axios.delete(
//                 `https://fintrack-api-9u9p.onrender.com/api/budget/${slug}`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             )
//             toast.success('Category deleted')
//             fetchCategories()
//         } catch (err) {
//             toast.error(err.response?.data?.message || err.message)
//         }
//     }

//     const openEditModal = budget => {
//         setEditBudget(budget);
//         setFormData({
//             category: 'Food',
//             limit: budget.limit,
//             month: budget.month
//         });
//         setModalOpen(true);
//     };


//     return (
//         <main className="budget-page">
//             <Toaster />

//             <div className="budget-head">
//                 <h1>Academic Categories</h1>
//                 <button className="btn-blue" onClick={() => setModalOpen(true)}>Add Category</button>
//             </div>

//             {isLoading ? (
//                 <p className="loading-text">Loading...</p>
//             ) : (
//                 <table className="budget-table">
//                     <thead>
//                         <tr>
//                             <th>Category Name</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {categories.length > 0 ? (
//                             categories.map((c, i) => (
//                                 <tr key={i}>
//                                     <td>{c.name}</td>
//                                     <td>
//                                         <button className="btn-edit" onClick={() => openEditModal(c)}>
//                                             <FaPencilAlt />
//                                         </button>
//                                         <button className="btn-edit" onClick={() => handleDelete(c.id)}>
//                                             <FaTrashAlt />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td id="NoBud" colSpan="2">No academic categories yet</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             )}

//             {modalOpen && (
//                 <div className="budget-modal">
//                     <div className="budget-modal-content">
//                         <h2>{editBudget ? 'Edit Budget' : 'Create Budget'}</h2>

//                         <form onSubmit={handleSubmit}>
//                             <select
//                                 name="category"
//                                 value={formData.category}
//                                 onChange={handleChange}
//                                 required
//                             >
//                                 <option value="">Select category</option>

//                                 {categories
//                                     .filter((c) =>
//                                         c.name.includes('Academic') ||
//                                         c.name.includes('Books') ||
//                                         c.name.includes('Tuition') ||
//                                         c.name.includes('Project')
//                                     )
//                                     .map((c) => (
//                                         <option key={c.id} value={c.name}>
//                                             {c.name}
//                                         </option>
//                                     ))}
//                             </select>

//                             <input
//                                 type="number"
//                                 name="limit"
//                                 placeholder="Limit"
//                                 value={formData.limit}
//                                 onChange={handleChange}
//                                 required
//                             />

//                             <input
//                                 type="month"
//                                 name="month"
//                                 value={formData.month}
//                                 onChange={handleChange}
//                                 required
//                             />

//                             <div className="modal-actions">
//                                 <button className="btn-blue" type="submit">
//                                     {editBudget ? 'Update' : 'Add'}
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="btn-blue"
//                                     onClick={() => {
//                                         setModalOpen(false)
//                                         setEditBudget(null)
//                                     }}
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </main>
//     )
// }
