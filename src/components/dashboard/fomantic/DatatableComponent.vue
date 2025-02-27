<script setup lang="ts">
import { defineProps, defineEmits, onBeforeMount, onMounted, ref, defineExpose } from 'vue'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net'
import DataTablesLib from 'datatables.net'
import 'datatables.net-buttons'
import 'datatables.net-buttons/js/buttons.html5'
import 'datatables.net-responsive'
import 'datatables.net-select'
import 'datatables.net-colreorder'
import 'datatables.net-colreorder-se'
import 'datatables.net-se'
import 'datatables.net-buttons-se'
import 'datatables.net-responsive-se'
import 'datatables.net-scroller'
import 'datatables.net-scroller-se'

import jszip from 'jszip'
// @ts-ignore
import pdfmake from 'pdfmake'
import { language, lengthMenu, buttons } from '../../../config/datatable.config'
import moment from 'moment'
import type { TableColumn, DatatableProps, ColumnDefinition } from '../../../types/datatable'

const API_BASE_URL = import.meta.env.VITE_API_URL

DataTable.use(DataTablesCore)
DataTable.use(DataTablesLib)
DataTablesLib.Buttons.jszip(jszip)
DataTablesLib.Buttons.pdfMake(pdfmake)

const emit = defineEmits(['edit', 'delete', 'checkbox', 'dynamic-action'])
const dtColumns = ref<ColumnDefinition[]>([])
const rowsMap: any = ref({})

const props = withDefaults(defineProps<DatatableProps>(), {
  showDefaultButtons: true,
  dynamicButtons: () => []
})

function handleEdit(id: string) {
  emit('edit', id)
}

function handleCheckbox(id: string, data: string, isChecked: boolean) {
  emit('checkbox', id, data, isChecked)
}

function handleDelete(id: string) {
  emit('delete', id)
}

function handleDynamicAction(action: string, id: string, row?: any) {
  emit('dynamic-action', { action, id, row })
}

const initializeButtons = () => {
  const checkBoxes = document.querySelectorAll('.my_checkbox-action')
  if (props.showDefaultButtons) {
    const editButtons = document.querySelectorAll('.edit-btn')
    const deleteButtons = document.querySelectorAll('.delete-btn')


    editButtons.forEach(button => {
      button.addEventListener('click', (event: Event) => {
        const target = event.target as HTMLElement
        const id = target.getAttribute('data-id')
        if (id) handleEdit(id)
      })
    })

    deleteButtons.forEach(button => {
      button.addEventListener('click', (event: Event) => {
        const target = event.target as HTMLElement
        const id = target.getAttribute('data-id')
        if (id) handleDelete(id)
      })
    })
  }

  // Initialize dynamic buttons
  props.dynamicButtons?.forEach(btn => {
    const dynamicButtons = document.querySelectorAll(`.dynamic-btn-${btn.action}`)
    dynamicButtons.forEach(button => {
      button.addEventListener('click', (event: Event) => {
        const target = event.target as HTMLElement
        const id = target.getAttribute('data-id') as string
        const row = rowsMap?.value?.[id] || null
        if (id) handleDynamicAction(btn.action, id, row)
      })
    })
  })

  // initialize checks
  checkBoxes.forEach(button => {
    button.addEventListener('change', (event: Event) => {
      const target = event.target as HTMLElement
      const id = target.getAttribute('data-id')
      const data = target.getAttribute('function-for')
      const isChecked = target.checked
      if (id) handleCheckbox(id, data, isChecked)
    })
  })

}

const table = ref()

const searchParams = ref<any>(null);

const options = ref({
  ajax: {
    url: `${API_BASE_URL}${props.uri}`,
    type: 'POST',
    dataSrc: 'data',
    headers: { Authorization: 'Bearer ' + localStorage.getItem('idToken') },
    data: function (d: any) {
      if (searchParams.value) {
        return { ...d, filters: searchParams.value };
      }
      return d;
    }
  },
  columnFilter: true,
  language: {
    ...language,
    aria: {
      sortAscending: language.aria.orderable,
      sortDescending: language.aria.orderableReverse
    }
  },
  lengthMenu,
  dom: '<"top">l<"clear"><br><br>fr<br><br>B<br><br>t<br><"bottom"pi><br><"clear">',
  pageLength: 10,
  searching: true,
  fixedHeader: false,
  buttons,
  processing: true,
  serverSide: true,
  drawCallback: function () {
    initializeButtons()
  },
})

onBeforeMount(() => {
  if (props.columns) {
    dtColumns.value = props.columns.map((column: TableColumn) => {
      const columnDef: ColumnDefinition = {
        data: column.data || '',
        title: column.title || column.data.toUpperCase()
      }
      if (column.type === 'enum') {
        columnDef.render = (data: string) => data?.toUpperCase() || ''
      }
      if (column.type === 'custom') {
        columnDef.render = (data: any, v: any, row: any) => {
          if (column.function_ && typeof column.function_ == 'function') {
            return column.function_(data, v, row)
          } else {
            return 'CONFIGURE LA FUNCION DE FORMA CORRECTA:  ' + column.title
          }
        }
      } else if (column.type === 'relationship') {
        columnDef.render = (data: any) => {
          const referenceName = column.referenceName;

          if (!referenceName) {
            return '';
          }

          if (Array.isArray(data)) {
            return data.map(item => item[referenceName] || '').join(', ');
          } else if (data && typeof data === 'object') {
            return data[referenceName] || '';
          } else {
            return '';
          }
        };
      } else if (column.type === 'number') {
        columnDef.render = (data: number) => String(data)
      } else if (column.type === 'date') {
        columnDef.render = (data: string) => data ? moment(data).format('YYYY-MM-DD HH:mm') : ''
      } else if (column.type === 'boolean') {
        columnDef.render = (data: boolean, _: any, row: any) => data ? `<input type="checkbox"  checked function-for="${column.data}" class="my_checkbox-action"  data-id="${row._id}">` : `<input type="checkbox"  function-for="${column.data}" class="my_checkbox-action"  data-id="${row._id}">`
      } else if (column.type === 'picture') {
        columnDef.render = (data: any, _: any, row: any) => {
          if (!data) {
            return column?.default || 'Sin Imagen'
          } else {
            if (Array.isArray(data)) {
              data = data[0] || ''
            }
            return data?.includes('http') ? `<img class="fluid" style="max-width: 75px; max-height: 75px" src="${data}">` : `<img class="fluid" style="max-width: 75px; max-height: 75px" src="${API_BASE_URL + 'files/view/' + data}">`
          }
        }
      } else {
        columnDef.render = (data: string) => data ? data : ''
      }

      return columnDef
    })

    // Add action column if there are any buttons to show
    if (props.showDefaultButtons || props.dynamicButtons?.length > 0) {
      dtColumns.value.push({
        data: '_id',
        title: 'ACTIONS',
        orderable: false,
        render: (_: any, __: any, row: any) => {
          let buttonsHtml = ''

          // Add default buttons if enabled
          if (props.showDefaultButtons) {
            buttonsHtml += `
              <button class="edit-btn compact mini ui primary button" data-id="${row._id}">
                <i aria-hidden="true" class="edit icon"></i>Editar
              </button>
              <button class="delete-btn compact mini ui red button" data-id="${row._id}">
                <i aria-hidden="true" class="trash icon"></i>Eliminar
              </button>
            `
          }

          // Add dynamic buttons
          props.dynamicButtons?.forEach(btn => {
            const btnClass = btn.class || 'teal'

            if (row._id) {
              rowsMap.value[row._id] = row
            }

            if (!btn.function_) {
              buttonsHtml += `
              <button class="dynamic-btn-${btn.action} compact mini ui ${btnClass} button" style="margin-bottom: 2px;" data-id="${row._id}">
                ${btn.icon ? `<i aria-hidden="true" class="${btn.icon} icon"></i>` : ''}${btn.label}
              </button>
            `
            } else {
              if (typeof btn.function_ == "function" && btn.function_(_, __, row)) {
                buttonsHtml += `
              <button class="dynamic-btn-${btn.action} compact mini ui ${btnClass} button" style="margin-bottom: 2px;"   data-id="${row._id}">
                ${btn.icon ? `<i aria-hidden="true" class="${btn.icon} icon"></i>` : ''}${btn.label}
              </button>
            `
              }
            }
          })
          return buttonsHtml
        },
      })
    }
  }
})

onMounted(() => {
  const dt = table.value.dt
  dt.draw()
})

// Function to force datatable redraw
const forceRedraw = (search?: any) => {
  console.log('forceRedraw', search);

  if (table.value && table.value.dt) {
    searchParams.value = search || null;
    table.value.dt.draw();
  }
}

// Expose the forceRedraw method to parent components
defineExpose({
  forceRedraw
})
</script>

<template>
  <div style="overflow-x: auto;">
    <DataTable ref="table" :columns="dtColumns" class="display ui teal celled selectable table" width="100%"
      :options="options" />
  </div>
</template>

<style scoped></style>