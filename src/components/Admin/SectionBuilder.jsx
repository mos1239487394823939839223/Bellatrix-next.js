import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import {

  Box,

  Button,

  Card,

  CardContent,

  Typography,

  IconButton,

  Dialog,

  DialogTitle,

  DialogContent,

  DialogActions,

  FormControl,

  InputLabel,

  Select,

  MenuItem,

  Chip,

  Tooltip,

  Alert,

} from '@mui/material';

import {

  DragIndicator as DragIcon,

  Edit as EditIcon,

  Delete as DeleteIcon,

  Add as AddIcon,

  ArrowBack as BackIcon,

  Save as SaveIcon,

  Preview as PreviewIcon,

} from '@mui/icons-material';

import {

  DndContext,

  closestCenter,

  KeyboardSensor,

  PointerSensor,

  useSensor,

  useSensors,

} from '@dnd-kit/core';

import {

  arrayMove,

  SortableContext,

  sortableKeyboardCoordinates,

  verticalListSortingStrategy,

} from '@dnd-kit/sortable';

import {

  useSortable,

} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import { useAdmin } from '../../hooks/useAdmin';

import SectionEditor from './SectionEditor';



// Sortable Section Item Component

const SortableSection = ({ section, onEdit, onDelete, index }) => {

  const {

    attributes,

    listeners,

    setNodeRef,

    transform,

    transition,

    isDragging,

  } = useSortable({ id: section.id });



  const style = {

    transform: CSS.Transform.toString(transform),

    transition,

    opacity: isDragging ? 0.5 : 1,

  };



  return (

    <Card

      ref={setNodeRef}

      style={style}

      className={`mb-4 transition-all duration-300 rounded-2xl border border-slate-200 ${

        isDragging 

          ? 'shadow-2xl scale-105 bg-white border-blue-300' 

          : 'hover:shadow-lg hover:border-blue-200 bg-white'

      }`}

    >

      <CardContent className="p-6">

        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-4">

            <div

              {...attributes}

              {...listeners}

              className="cursor-grab active:cursor-grabbing p-2 rounded-xl hover:bg-slate-100 transition-colors"

            >

              <DragIcon className="text-slate-400 hover:text-slate-600" />

            </div>

            

            <div className="flex-1">

              <div className="flex items-center gap-3 mb-2">

                <Typography variant="h6" className="text-slate-800 font-bold">

                  {section.name || `Section ${index + 1}`}

                </Typography>

                <Chip

                  label={section.type}

                  size="small"

                  className="bg-blue-100 text-blue-800 border-blue-200 capitalize font-medium"

                />

              </div>

              <div className="flex items-center space-x-4 text-sm text-slate-600">

                <span className="flex items-center gap-1">

                  <span className="w-2 h-2 bg-slate-400 rounded-full"></span>

                  Order: {section.order || index + 1}

                </span>

                {section.description && (

                  <span className="flex items-center gap-1">

                    <span className="w-2 h-2 bg-violet-400 rounded-full"></span>

                    {section.description}

                  </span>

                )}

              </div>

            </div>

          </div>

          

          <div className="flex items-center space-x-2">

            <Tooltip title="Edit Section">

              <IconButton

                size="small"

                onClick={() => onEdit(section)}

                className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"

              >

                <EditIcon fontSize="small" />

              </IconButton>

            </Tooltip>

            <Tooltip title="Delete Section">

              <IconButton

                size="small"

                onClick={() => onDelete(section.id)}

                className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"

              >

                <DeleteIcon fontSize="small" />

              </IconButton>

            </Tooltip>

          </div>

        </div>



        {/* Section Preview */}

        <div className="mt-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">

          <Typography variant="body2" className="text-slate-700 font-medium mb-2">

            {section.description || 'No description available'}

          </Typography>

          {section.fields && (

            <div className="flex flex-wrap gap-2">

              {Object.keys(section.fields || {}).map((field, idx) => (

                <span

                  key={idx}

                  className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200"

                >

                  {field}

                </span>

              ))}

              {Object.keys(section.fields || {}).length === 0 && (

                <span className="text-xs text-slate-500">No fields configured</span>

              )}

            </div>

          )}

        </div>

      </CardContent>

    </Card>

  );

};



const SectionBuilder = ({ page }) => {

  const router = useRouter();

  const { templates, api } = useAdmin();

  const [sections, setSections] = useState(page.sections || []);

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState('');

  const [editingSection, setEditingSection] = useState(null);

  const [hasChanges, setHasChanges] = useState(false);



  const sensors = useSensors(

    useSensor(PointerSensor),

    useSensor(KeyboardSensor, {

      coordinateGetter: sortableKeyboardCoordinates,

    })

  );



  useEffect(() => {

    // Load actual page data from JSON file

    const loadPageData = async () => {

      try {

        const data = await api.fetchPageData(page.fileName);

        if (data) {

          // Convert JSON structure to sections

          const convertedSections = convertDataToSections(data);

          setSections(convertedSections);

        }

      } catch (error) {

        console.error('Error loading page data:', error);

      }

    };



    loadPageData();

  }, [page.fileName, api]);



  const convertDataToSections = (data) => {

    const sections = [];

    let sectionId = 1;



    // Convert each top-level key to a section

    Object.keys(data).forEach(key => {

      sections.push({

        id: sectionId++,

        name: key.charAt(0).toUpperCase() + key.slice(1),

        type: key,

        order: sections.length + 1,

        fields: data[key],

        description: `${key} section data`,

      });

    });



    return sections;

  };



  const handleDragEnd = (event) => {

    const { active, over } = event;



    if (active.id !== over?.id) {

      setSections((items) => {

        const oldIndex = items.findIndex(item => item.id === active.id);

        const newIndex = items.findIndex(item => item.id === over.id);

        const newSections = arrayMove(items, oldIndex, newIndex);

        

        // Update order

        const updatedSections = newSections.map((section, index) => ({

          ...section,

          order: index + 1,

        }));



        setHasChanges(true);

        return updatedSections;

      });

    }

  };



  const handleAddSection = () => {

    if (!selectedTemplate) return;



    const template = templates.find(t => t.id === selectedTemplate);

    if (!template) return;



    const newSection = {

      id: Date.now(),

      name: template.name,

      type: template.type || 'custom',

      order: sections.length + 1,

      fields: template.fields ? template.fields.reduce((acc, field) => {

        acc[field] = '';

        return acc;

      }, {}) : {},

      description: template.description,

      template: template.id,

    };



    setSections([...sections, newSection]);

    setSelectedTemplate('');

    setOpenAddDialog(false);

    setHasChanges(true);

  };



  const handleEditSection = (section) => {

    setEditingSection(section);

  };



  const handleSaveSection = (updatedSection) => {

    setSections(sections.map(s => s.id === updatedSection.id ? updatedSection : s));

    setEditingSection(null);

    setHasChanges(true);

  };



  const handleDeleteSection = (sectionId) => {

    if (window.confirm('Are you sure you want to delete this section?')) {

      setSections(sections.filter(s => s.id !== sectionId));

      setHasChanges(true);

    }

  };



  const handleSavePage = async () => {

    try {

      // Convert sections back to JSON structure

      const pageData = {};

      sections.forEach(section => {

        pageData[section.type] = section.fields;

      });



      await api.saveDataFile(page.fileName, pageData);

      

      // Update page sections

      await api.updatePage(page.id, {

        ...page,

        sections: sections,

      });



      setHasChanges(false);

      alert('Page saved successfully!');

    } catch (error) {

      console.error('Error saving page:', error);

      alert('Error saving page. Please try again.');

    }

  };



  const sectionTemplates = templates.filter(t => t.category === 'Section');



  return (

    <div className="min-h-screen bg-slate-50 p-6">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center space-x-4">

              <Button

                startIcon={<BackIcon />}

                onClick={() => router.push('/admin/pages')}

                variant="outlined"

                className="border-slate-300 text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 rounded-xl"

              >

                Back to Pages

              </Button>

              

              <div className="border-l border-slate-200 pl-4">

                <div className="flex items-center gap-3 mb-2">

                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">

                    <Typography variant="h6" className="text-white font-bold">

                      

                    </Typography>

                  </div>

                  <div>

                    <Typography variant="h4" className="text-slate-800 font-bold capitalize">

                      {page.name}

                    </Typography>

                    <Typography variant="body2" className="text-slate-600">

                      Building sections for {page.fileName}

                    </Typography>

                  </div>

                </div>

              </div>

            </div>



            <div className="flex items-center space-x-3">

              {hasChanges && (

                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">

                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>

                  <Typography variant="body2" className="text-amber-700 font-medium">

                    Unsaved changes

                  </Typography>

                </div>

              )}

              

              <Button

                startIcon={<PreviewIcon />}

                variant="outlined"

                onClick={() => window.open('/', '_blank')}

                className="border-slate-300 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl"

              >

                Preview

              </Button>

              

              <Button

                startIcon={<SaveIcon />}

                variant="contained"

                onClick={handleSavePage}

                disabled={!hasChanges}

                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl px-6"

              >

                Save Page

              </Button>

            </div>

          </div>

        </div>



        {/* Section Builder */}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

          <div className="xl:col-span-3">

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

              <div className="p-6 border-b border-slate-100">

                <div className="flex items-center justify-between">

                  <div>

                    <Typography variant="h6" className="text-slate-800 font-bold mb-2">

                      Page Sections ({sections.length})

                    </Typography>

                    <Typography variant="body2" className="text-slate-600">

                      Drag and drop to reorder sections

                    </Typography>

                  </div>

                  <Button

                    startIcon={<AddIcon />}

                    variant="outlined"

                    onClick={() => setOpenAddDialog(true)}

                    className="border-slate-300 text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 rounded-xl"

                  >

                    Add Section

                  </Button>

                </div>

              </div>



              <div className="p-6">

                {sections.length === 0 ? (

                  <div className="text-center py-16">

                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">

                      <Typography variant="h3" className="text-slate-400">

                        

                      </Typography>

                    </div>

                    <Typography variant="h6" className="text-slate-800 font-bold mb-3">

                      No sections yet

                    </Typography>

                    <Typography variant="body1" className="text-slate-600 mb-8 max-w-md mx-auto">

                      Start building your page by adding sections. You can choose from our templates or create custom content.

                    </Typography>

                    <Button

                      startIcon={<AddIcon />}

                      variant="contained"

                      onClick={() => setOpenAddDialog(true)}

                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl px-8"

                    >

                      Add Your First Section

                    </Button>

                  </div>

                ) : (

                  <DndContext

                    sensors={sensors}

                    collisionDetection={closestCenter}

                    onDragEnd={handleDragEnd}

                  >

                    <SortableContext items={sections} strategy={verticalListSortingStrategy}>

                      <div className="space-y-4">

                        {sections.map((section, index) => (

                          <SortableSection

                            key={section.id}

                            section={section}

                            index={index}

                            onEdit={handleEditSection}

                            onDelete={handleDeleteSection}

                          />

                        ))}

                      </div>

                    </SortableContext>

                  </DndContext>

                )}

              </div>

            </div>

          </div>



          {/* Section Templates Sidebar */}

          <div className="xl:col-span-1">

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm sticky top-6">

              <div className="p-6 border-b border-slate-100">

                <Typography variant="h6" className="text-slate-800 font-bold mb-2">

                  Available Templates

                </Typography>

                <Typography variant="body2" className="text-slate-600">

                  Click to add sections

                </Typography>

              </div>

              <div className="p-6">

                <div className="space-y-3">

                  {sectionTemplates.map((template) => (

                    <div

                      key={template.id}

                      className="group p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200"

                      onClick={() => {

                        setSelectedTemplate(template.id);

                        setOpenAddDialog(true);

                      }}

                    >

                      <div className="flex items-start gap-3">

                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">

                          <Typography variant="body2" className="text-white font-bold">

                            

                          </Typography>

                        </div>

                        <div className="flex-1">

                          <Typography variant="subtitle1" className="text-slate-800 font-semibold group-hover:text-blue-700">

                            {template.name}

                          </Typography>

                          <Typography variant="caption" className="text-slate-600 mt-1 block">

                            {template.description}

                          </Typography>

                        </div>

                      </div>

                    </div>

                  ))}

                  

                  {sectionTemplates.length === 0 && (

                    <div className="text-center py-8">

                      <Typography variant="body2" className="text-slate-500">

                        No templates available

                      </Typography>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>

        </div>



        {/* Add Section Dialog */}

        <Dialog 

          open={openAddDialog} 

          onClose={() => setOpenAddDialog(false)} 

          maxWidth="sm" 

          fullWidth

          PaperProps={{

            className: "rounded-2xl"

          }}

        >

          <DialogTitle className="border-b border-slate-100 bg-slate-50">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">

                <Typography variant="h6" className="text-white font-bold">

                  

                </Typography>

              </div>

              <div>

                <Typography variant="h6" className="text-slate-800 font-bold">

                  Add New Section

                </Typography>

                <Typography variant="body2" className="text-slate-600">

                  Choose a template to get started

                </Typography>

              </div>

            </div>

          </DialogTitle>

          <DialogContent className="p-6">

            <FormControl fullWidth className="mt-4">

              <InputLabel className="text-slate-600">Select Template</InputLabel>

              <Select

                value={selectedTemplate}

                onChange={(e) => setSelectedTemplate(e.target.value)}

                className="rounded-xl"

              >

                {sectionTemplates.map((template) => (

                  <MenuItem key={template.id} value={template.id} className="py-3">

                    <div className="flex items-center gap-3">

                      <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">

                        <Typography variant="caption" className="text-white font-bold">

                          

                        </Typography>

                      </div>

                      <div>

                        <Typography variant="body1" className="text-slate-800 font-medium">

                          {template.name}

                        </Typography>

                        <Typography variant="caption" className="text-slate-500">

                          {template.description}

                        </Typography>

                      </div>

                    </div>

                  </MenuItem>

                ))}

              </Select>

            </FormControl>

          </DialogContent>

          <DialogActions className="border-t border-slate-100 bg-slate-50 p-6 gap-3">

            <Button 

              onClick={() => setOpenAddDialog(false)}

              variant="outlined"

              className="border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-100 rounded-xl px-6"

            >

              Cancel

            </Button>

            <Button

              onClick={handleAddSection}

              variant="contained"

              disabled={!selectedTemplate}

              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl px-8"

            >

              Add Section

            </Button>

          </DialogActions>

        </Dialog>



      {/* Section Editor Dialog */}

      {editingSection && (

        <SectionEditor

          section={editingSection}

          onSave={handleSaveSection}

          onCancel={() => setEditingSection(null)}

        />

      )}

      </div>

    </div>

  );

};



export default SectionBuilder;
