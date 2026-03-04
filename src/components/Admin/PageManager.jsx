'use client'
import React, { useState, useEffect } from "react";

import { useRouter, useParams } from 'next/navigation';

import {

  Box,

  Button,

  Card,

  CardContent,

  CardActions,

  Chip,

  Dialog,

  DialogTitle,

  DialogContent,

  DialogActions,

  Grid,

  IconButton,

  TextField,

  Typography,

  FormControl,

  InputLabel,

  Select,

  MenuItem,

  Fab,

  Tooltip,

  Alert,

  LinearProgress,

} from "@mui/material";

import {

  Add as AddIcon,

  Edit as EditIcon,

  Delete as DeleteIcon,

  Visibility as PreviewIcon,

  FileCopy as DuplicateIcon,

  Download as ExportIcon,

  Refresh as RefreshIcon,

} from "@mui/icons-material";

import { useAdmin } from "../../hooks/useAdmin";

import SectionBuilder from "./SectionBuilder";



const PageManager = () => {

  const router = useRouter();

  const { pageId } = useParams();

  const { pages, templates, loading, api } = useAdmin();



  const [openDialog, setOpenDialog] = useState(false);

  const [selectedPage, setSelectedPage] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [pageForm, setPageForm] = useState({

    name: "",

    fileName: "",

    template: "",

    status: "Draft",

    seo: {

      title: "",

      description: "",

      keywords: "",

    },

  });



  useEffect(() => {

    if (pageId && pages.length > 0) {

      const page = pages.find((p) => p.id === parseInt(pageId));

      if (page) {

        setSelectedPage(page);

        setIsEditing(true);

        setPageForm(page);

      }

    }

  }, [pageId, pages]);



  const handleCreatePage = () => {

    setPageForm({

      name: "",

      fileName: "",

      template: "",

      status: "Draft",

      seo: {

        title: "",

        description: "",

        keywords: "",

      },

    });

    setSelectedPage(null);

    setIsEditing(false);

    setOpenDialog(true);

  };



  const handleEditPage = (page) => {

    setSelectedPage(page);

    setPageForm(page);

    setIsEditing(true);

    setOpenDialog(true);

  };



  const handleSavePage = async () => {

    try {

      const fileName =

        pageForm.fileName ||

        pageForm.name.toLowerCase().replace(/\s+/g, "") + ".json";

      const pageData = {

        ...pageForm,

        fileName,

      };



      if (isEditing && selectedPage) {

        await api.updatePage(selectedPage.id, pageData);

      } else {

        await api.createPage(pageData);

      }



      setOpenDialog(false);

      router.push("/admin/pages");

    } catch (error) {

      console.error("Error saving page:", error);

    }

  };



  const handleDeletePage = async (pageId) => {

    if (window.confirm("Are you sure you want to delete this page?")) {

      try {

        await api.deletePage(pageId);

      } catch (error) {

        console.error("Error deleting page:", error);

      }

    }

  };



  const handleDuplicatePage = async (page) => {

    const duplicatedPage = {

      ...page,

      name: `${page.name} (Copy)`,

      fileName: `${page.fileName.replace(".json", "")}_copy.json`,

      status: "Draft",

    };

    try {

      await api.createPage(duplicatedPage);

    } catch (error) {

      console.error("Error duplicating page:", error);

    }

  };



  const pageTemplates = templates.filter((t) => t.category === "Page");



  if (loading) {

    return (

      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">

        <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-2xl border border-gray-700/50 shadow-xl p-8 backdrop-blur-sm">

          <div className="text-center space-y-4">

            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-pulse">

              <Typography variant="h6" className="text-white font-bold text-2xl">

                

              </Typography>

            </div>

            <Typography variant="h6" className="text-white font-bold">

              Loading pages...

            </Typography>

            <LinearProgress 

              className="bg-gray-700 rounded-full overflow-hidden"

              sx={{

                '& .MuiLinearProgress-bar': {

                  background: 'linear-gradient(90deg, rgb(59 130 246), rgb(147 51 234))',

                }

              }}

            />

          </div>

        </div>

      </div>

    );

  }



  // If editing a specific page, show the section builder

  if (pageId && selectedPage) {

    return <SectionBuilder page={selectedPage} />;

  }



  return (

    <div className="min-h-screen bg-gray-900 p-4 sm:p-6">

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

        {/* Header */}

        <div className="bg-gradient-to-r from-gray-800 to-gray-750 rounded-2xl border border-gray-700/50 shadow-xl p-6 sm:p-8 backdrop-blur-sm">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

            <div className="space-y-2">

              <Typography

                variant="h4"

                className="text-white font-bold text-2xl sm:text-3xl bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"

              >

                Page Management

              </Typography>

              <Typography

                variant="body1"

                className="text-gray-400 text-sm sm:text-base"

              >

                Create, edit, and organize your website pages with ease

              </Typography>

            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">

              <Button

                variant="outlined"

                startIcon={<RefreshIcon />}

                onClick={() => api.fetchPages()}

                className="border-gray-600 text-gray-300 hover:border-blue-400 hover:bg-blue-500/10 hover:text-blue-400 rounded-xl transition-all duration-300 px-6 py-2 w-full sm:w-auto backdrop-blur-sm"

              >

                Refresh

              </Button>

              <Button

                variant="contained"

                startIcon={<AddIcon />}

                onClick={handleCreatePage}

                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 rounded-xl px-6 py-2 w-full sm:w-auto transform hover:scale-105"

              >

                New Page

              </Button>

            </div>

          </div>

        </div>



        {/* Stats */}

        <Grid container spacing={4}>

          <Grid item xs={12} sm={6} md={3}>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-850 border border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 rounded-2xl backdrop-blur-sm group hover:scale-105">

              <CardContent className="p-6">

                <div className="flex items-center justify-between">

                  <div className="flex-1">

                    <Typography

                      variant="h3"

                      className="text-white font-bold mb-1 text-3xl"

                    >

                      {pages.length}

                    </Typography>

                    <Typography

                      variant="body2"

                      className="text-gray-400 font-medium"

                    >

                      Total Pages

                    </Typography>

                  </div>

                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:from-blue-400 group-hover:to-blue-500 transition-all duration-300">

                    <Typography variant="h6" className="text-white font-bold text-2xl">

                      

                    </Typography>

                  </div>

                </div>

              </CardContent>

            </Card>

          </Grid>

          <Grid item xs={12} sm={6} md={3}>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-850 border border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 rounded-2xl backdrop-blur-sm group hover:scale-105">

              <CardContent className="p-6">

                <div className="flex items-center justify-between">

                  <div className="flex-1">

                    <Typography

                      variant="h3"

                      className="text-white font-bold mb-1 text-3xl"

                    >

                      {pages.filter((p) => p.status === "Published").length}

                    </Typography>

                    <Typography

                      variant="body2"

                      className="text-gray-400 font-medium"

                    >

                      Published

                    </Typography>

                  </div>

                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:from-emerald-400 group-hover:to-emerald-500 transition-all duration-300">

                    <Typography variant="h6" className="text-white font-bold text-2xl">

                      

                    </Typography>

                  </div>

                </div>

              </CardContent>

            </Card>

          </Grid>

          <Grid item xs={12} sm={6} md={3}>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-850 border border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 rounded-2xl backdrop-blur-sm group hover:scale-105">

              <CardContent className="p-6">

                <div className="flex items-center justify-between">

                  <div className="flex-1">

                    <Typography

                      variant="h3"

                      className="text-white font-bold mb-1 text-3xl"

                    >

                      {pages.filter((p) => p.status === "Draft").length}

                    </Typography>

                    <Typography

                      variant="body2"

                      className="text-gray-400 font-medium"

                    >

                      Drafts

                    </Typography>

                  </div>

                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:from-amber-400 group-hover:to-amber-500 transition-all duration-300">

                    <Typography variant="h6" className="text-white font-bold text-2xl">

                      

                    </Typography>

                  </div>

                </div>

              </CardContent>

            </Card>

          </Grid>

          <Grid item xs={12} sm={6} md={3}>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-850 border border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 rounded-2xl backdrop-blur-sm group hover:scale-105">

              <CardContent className="p-6">

                <div className="flex items-center justify-between">

                  <div className="flex-1">

                    <Typography

                      variant="h3"

                      className="text-white font-bold mb-1 text-3xl"

                    >

                      {pageTemplates.length}

                    </Typography>

                    <Typography

                      variant="body2"

                      className="text-gray-400 font-medium"

                    >

                      Templates

                    </Typography>

                  </div>

                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:from-violet-400 group-hover:to-violet-500 transition-all duration-300">

                    <Typography variant="h6" className="text-white font-bold text-2xl">

                      

                    </Typography>

                  </div>

                </div>

              </CardContent>

            </Card>

          </Grid>

        </Grid>



        {/* Pages Grid */}

        <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-2xl border border-gray-700/50 shadow-xl backdrop-blur-sm">

          <div className="p-6 border-b border-gray-700/50">

            <div className="flex items-center justify-between">

              <div>

                <Typography

                  variant="h6"

                  className="text-white font-bold mb-2 text-xl"

                >

                  All Pages

                </Typography>

                <Typography variant="body2" className="text-gray-400">

                  Manage your website pages and content

                </Typography>

              </div>

              <div className="flex items-center gap-4">

                <Typography variant="body2" className="text-gray-500">

                  {pages.length} {pages.length === 1 ? "page" : "pages"}

                </Typography>

                <Button

                  variant="outlined"

                  size="small"

                  startIcon={<AddIcon />}

                  onClick={handleCreatePage}

                  className="border-gray-600 text-gray-300 hover:border-blue-400 hover:bg-blue-500/10 hover:text-blue-400 rounded-xl transition-all duration-300"

                >

                  Add Page

                </Button>

              </div>

            </div>

          </div>



          <div className="p-6">

            <Grid container spacing={4}>

              {pages.map((page) => (

                <Grid item xs={12} sm={6} lg={4} key={page.id}>

                  <Card className="h-full flex flex-col hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-750 to-gray-800 backdrop-blur-sm group hover:scale-105">

                    <CardContent className="flex-1 p-6">

                      <div className="flex items-start justify-between mb-4">

                        <div className="flex-1">

                          <Typography

                            variant="h6"

                            className="text-white font-bold mb-1 capitalize line-clamp-1 group-hover:text-blue-300 transition-colors duration-300"

                          >

                            {page.name}

                          </Typography>

                          <Typography

                            variant="body2"

                            className="text-gray-400 text-sm"

                          >

                            {page.fileName}

                          </Typography>

                        </div>

                        <Chip

                          label={page.status}

                          size="small"

                          className={`ml-2 ${

                            page.status === "Published"

                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"

                              : "bg-amber-500/20 text-amber-300 border-amber-500/30"

                          } backdrop-blur-sm`}

                        />

                      </div>



                      <div className="space-y-3 mb-4">

                        <div className="flex items-center text-sm text-gray-400">

                          <span className="w-2 h-2 bg-violet-400 rounded-full mr-3 shadow-sm shadow-violet-400/50"></span>

                          Template: {page.template || "Default"}

                        </div>

                        <div className="flex items-center text-sm text-gray-400">

                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 shadow-sm shadow-blue-400/50"></span>

                          Modified:{" "}

                          {new Date(page.lastModified).toLocaleDateString()}

                        </div>

                      </div>



                      <div className="flex flex-wrap gap-2 mb-4">

                        {page.status === "Published" && (

                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">

                             Live

                          </span>

                        )}

                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-600/20 text-gray-300 border border-gray-600/30 backdrop-blur-sm">

                           Page

                        </span>

                      </div>

                    </CardContent>



                    <CardActions className="px-6 pb-6 pt-0">

                      <div className="flex items-center justify-between w-full">

                        <div className="flex items-center gap-2">

                          <Tooltip title="Preview Page">

                            <IconButton

                              size="small"

                              onClick={() => window.open("/", "_blank")}

                              className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-300 backdrop-blur-sm"

                            >

                              <PreviewIcon fontSize="small" />

                            </IconButton>

                          </Tooltip>

                          <Tooltip title="Edit Page">

                            <IconButton

                              size="small"

                              onClick={() =>

                                router.push(`/admin/pages/${page.id}`)

                              }

                              className="text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all duration-300 backdrop-blur-sm"

                            >

                              <EditIcon fontSize="small" />

                            </IconButton>

                          </Tooltip>

                          <Tooltip title="Duplicate Page">

                            <IconButton

                              size="small"

                              onClick={() => handleDuplicatePage(page)}

                              className="text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-xl transition-all duration-300 backdrop-blur-sm"

                            >

                              <DuplicateIcon fontSize="small" />

                            </IconButton>

                          </Tooltip>

                        </div>

                        <Tooltip title="Delete Page">

                          <IconButton

                            size="small"

                            onClick={() => handleDeletePage(page.id)}

                            className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 backdrop-blur-sm"

                          >

                            <DeleteIcon fontSize="small" />

                          </IconButton>

                        </Tooltip>

                      </div>

                    </CardActions>

                  </Card>

                </Grid>

              ))}

            </Grid>

          </div>

        </div>



        {pages.length === 0 && (

          <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-2xl border border-gray-700/50 shadow-xl backdrop-blur-sm">

            <div className="text-center py-20 px-6">

              <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">

                <Typography variant="h3" className="text-gray-400">

                  

                </Typography>

              </div>

              <Typography

                variant="h5"

                className="text-white font-bold mb-3"

              >

                No pages found

              </Typography>

              <Typography

                variant="body1"

                className="text-gray-400 mb-8 max-w-md mx-auto"

              >

                Get started by creating your first page. You can choose from our

                templates or start from scratch.

              </Typography>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">

                <Button

                  variant="contained"

                  startIcon={<AddIcon />}

                  onClick={handleCreatePage}

                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 rounded-xl px-8 py-3 transform hover:scale-105"

                >

                  Create Your First Page

                </Button>

                <Button

                  variant="outlined"

                  onClick={() => router.push("/admin/templates")}

                  className="border-gray-600 text-gray-300 hover:border-blue-400 hover:bg-blue-500/10 hover:text-blue-400 rounded-xl px-8 py-3 transition-all duration-300 backdrop-blur-sm"

                >

                  Browse Templates

                </Button>

              </div>

            </div>

          </div>

        )}



        {/* Create/Edit Dialog */}

        <Dialog

          open={openDialog}

          onClose={() => setOpenDialog(false)}

          maxWidth="md"

          fullWidth

          PaperProps={{

            className: "rounded-2xl bg-gray-800 border border-gray-700/50 backdrop-blur-sm",

          }}

        >

          <DialogTitle className="border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-750">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">

                <Typography variant="h6" className="text-white font-bold text-xl">

                  {isEditing ? "" : ""}

                </Typography>

              </div>

              <div>

                <Typography variant="h6" className="text-white font-bold text-xl">

                  {isEditing ? "Edit Page" : "Create New Page"}

                </Typography>

                <Typography variant="body2" className="text-gray-400">

                  {isEditing

                    ? "Update page settings and content"

                    : "Add a new page to your website"}

                </Typography>

              </div>

            </div>

          </DialogTitle>

          <DialogContent className="bg-gray-800">

            <div className="space-y-6 pt-6">

              <TextField

                label="Page Name"

                fullWidth

                value={pageForm.name}

                onChange={(e) =>

                  setPageForm({ ...pageForm, name: e.target.value })

                }

                placeholder="e.g., About Us, Services, Contact"

                className="bg-gray-700/50 rounded-xl"

                InputProps={{

                  className: "text-white bg-gray-700/50 rounded-xl",

                }}

                InputLabelProps={{

                  className: "text-gray-400",

                }}

              />



              <TextField

                label="File Name"

                fullWidth

                value={pageForm.fileName}

                onChange={(e) =>

                  setPageForm({ ...pageForm, fileName: e.target.value })

                }

                placeholder="e.g., about.json, services.json"

                helperText="File name for storing page data (auto-generated if empty)"

                className="bg-gray-700/50 rounded-xl"

                InputProps={{

                  className: "text-white bg-gray-700/50 rounded-xl",

                }}

                InputLabelProps={{

                  className: "text-gray-400",

                }}

                FormHelperTextProps={{

                  className: "text-gray-500",

                }}

              />



              <FormControl fullWidth className="bg-gray-700/50 rounded-xl">

                <InputLabel className="text-gray-400">Template</InputLabel>

                <Select

                  value={pageForm.template}

                  onChange={(e) =>

                    setPageForm({ ...pageForm, template: e.target.value })

                  }

                  className="text-white bg-gray-700/50 rounded-xl"

                >

                  <MenuItem value="">Default</MenuItem>

                  {pageTemplates.map((template) => (

                    <MenuItem key={template.id} value={template.name}>

                      {template.name}

                    </MenuItem>

                  ))}

                </Select>

              </FormControl>



              <FormControl fullWidth className="bg-gray-700/50 rounded-xl">

                <InputLabel className="text-gray-400">Status</InputLabel>

                <Select

                  value={pageForm.status}

                  onChange={(e) =>

                    setPageForm({ ...pageForm, status: e.target.value })

                  }

                  className="text-white bg-gray-700/50 rounded-xl"

                >

                  <MenuItem value="Draft">Draft</MenuItem>

                  <MenuItem value="Published">Published</MenuItem>

                </Select>

              </FormControl>



              {/* SEO Section */}

              <div className="pt-4">

                <Typography variant="h6" className="text-white font-bold mb-4 flex items-center gap-2">

                   SEO Settings

                </Typography>



                <div className="space-y-4">

                  <TextField

                    label="Meta Title"

                    fullWidth

                    value={pageForm.seo.title}

                    onChange={(e) =>

                      setPageForm({

                        ...pageForm,

                        seo: { ...pageForm.seo, title: e.target.value },

                      })

                    }

                    className="bg-gray-700/50 rounded-xl"

                    InputProps={{

                      className: "text-white bg-gray-700/50 rounded-xl",

                    }}

                    InputLabelProps={{

                      className: "text-gray-400",

                    }}

                  />



                  <TextField

                    label="Meta Description"

                    fullWidth

                    multiline

                    rows={3}

                    value={pageForm.seo.description}

                    onChange={(e) =>

                      setPageForm({

                        ...pageForm,

                        seo: { ...pageForm.seo, description: e.target.value },

                      })

                    }

                    className="bg-gray-700/50 rounded-xl"

                    InputProps={{

                      className: "text-white bg-gray-700/50 rounded-xl",

                    }}

                    InputLabelProps={{

                      className: "text-gray-400",

                    }}

                  />



                  <TextField

                    label="Keywords"

                    fullWidth

                    value={pageForm.seo.keywords}

                    onChange={(e) =>

                      setPageForm({

                        ...pageForm,

                        seo: { ...pageForm.seo, keywords: e.target.value },

                      })

                    }

                    placeholder="keyword1, keyword2, keyword3"

                    className="bg-gray-700/50 rounded-xl"

                    InputProps={{

                      className: "text-white bg-gray-700/50 rounded-xl",

                    }}

                    InputLabelProps={{

                      className: "text-gray-400",

                    }}

                  />

                </div>

              </div>

            </div>

          </DialogContent>

          <DialogActions className="border-t border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-750 p-6 gap-4">

            <Button

              onClick={() => setOpenDialog(false)}

              variant="outlined"

              className="border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50 rounded-xl px-6 transition-all duration-300"

            >

              Cancel

            </Button>

            <Button

              onClick={handleSavePage}

              variant="contained"

              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 rounded-xl px-8 transform hover:scale-105"

              disabled={!pageForm.name}

            >

              {isEditing ? "Update Page" : "Create Page"}

            </Button>

          </DialogActions>

        </Dialog>



        {/* Floating Action Button */}

        <Fab

          color="primary"

          aria-label="add page"

          sx={{

            position: "fixed",

            bottom: 32,

            right: 32,

            background: "linear-gradient(135deg, rgb(59 130 246), rgb(147 51 234))",

            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",

            "&:hover": {

              background: "linear-gradient(135deg, rgb(37 99 235), rgb(126 34 206))",

              boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",

              transform: "translateY(-4px) scale(1.05)",

            },

            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

            border: "1px solid rgba(255, 255, 255, 0.1)",

            backdropFilter: "blur(16px)",

          }}

          onClick={handleCreatePage}

        >

          <AddIcon />

        </Fab>

      </div>

    </div>

  );

};



export default PageManager;

