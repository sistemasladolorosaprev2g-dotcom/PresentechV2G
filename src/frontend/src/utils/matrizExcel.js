import * as XLSX from 'xlsx'

const STATUS_LABELS = {
  P: '✓',
  X: 'X',
  '-': '-',
}

function getMonthGroups(days) {
  const groups = []

  days.forEach((day, index) => {
    const lastGroup = groups[groups.length - 1]
    if (lastGroup?.month === day.mes) {
      lastGroup.count += 1
    } else {
      groups.push({ month: day.mes, startIndex: index, count: 1 })
    }
  })

  return groups
}

function buildRows(matriz) {
  const summaryHeaders = [
    'Asist.',
    'Faltas',
    'Parc.',
    'Asist.',
    'Faltas',
    'Parc.',
    'Asist.',
    'Faltas',
    'Parc.',
    'Faltas',
    'Parc.',
  ]

  const firstRow = ['No.', 'Nombre del Alumno']
  const secondRow = ['', '']
  const thirdRow = ['', '']

  matriz.dias.forEach((day) => {
    firstRow.push('')
    secondRow.push(day.dia_mes)
    thirdRow.push(day.inicial_dia)
  })

  firstRow.push(
    'Septiembre - Diciembre',
    '',
    '',
    'Enero - Marzo',
    '',
    '',
    'Abril - Junio',
    '',
    '',
    'Total',
    '',
  )
  secondRow.push(...summaryHeaders)
  thirdRow.push(...summaryHeaders)

  const studentRows = matriz.estudiantes.map((student) => {
    const row = [student.numero, student.nombre_estudiante]

    matriz.dias.forEach((day) => {
      const status = student.estados_por_fecha?.[day.fecha] ?? ''
      row.push(STATUS_LABELS[status] ?? '')
    })

    const periodo1 = student.resumen_periodos?.periodo_1 ?? {}
    const periodo2 = student.resumen_periodos?.periodo_2 ?? {}
    const periodo3 = student.resumen_periodos?.periodo_3 ?? {}

    row.push(
      periodo1.asistencias ?? 0,
      periodo1.faltas ?? 0,
      periodo1.parciales ?? 0,
      periodo2.asistencias ?? 0,
      periodo2.faltas ?? 0,
      periodo2.parciales ?? 0,
      periodo3.asistencias ?? 0,
      periodo3.faltas ?? 0,
      periodo3.parciales ?? 0,
      student.total_faltas ?? 0,
      student.total_parciales ?? 0,
    )

    return row
  })

  return [firstRow, secondRow, thirdRow, ...studentRows]
}

function buildMerges(matriz) {
  const merges = [
    { s: { r: 0, c: 0 }, e: { r: 2, c: 0 } },
    { s: { r: 0, c: 1 }, e: { r: 2, c: 1 } },
  ]

  getMonthGroups(matriz.dias).forEach((group) => {
    const start = 2 + group.startIndex
    const end = start + group.count - 1
    merges.push({ s: { r: 0, c: start }, e: { r: 0, c: end } })
  })

  const summaryStart = 2 + matriz.dias.length
  merges.push({ s: { r: 0, c: summaryStart }, e: { r: 0, c: summaryStart + 2 } })
  merges.push({ s: { r: 0, c: summaryStart + 3 }, e: { r: 0, c: summaryStart + 5 } })
  merges.push({ s: { r: 0, c: summaryStart + 6 }, e: { r: 0, c: summaryStart + 8 } })
  merges.push({ s: { r: 0, c: summaryStart + 9 }, e: { r: 0, c: summaryStart + 10 } })

  return merges
}

function applyWorksheetMetadata(sheet, matriz) {
  const totalColumns = 2 + matriz.dias.length + 11

  sheet['!merges'] = buildMerges(matriz)
  sheet['!cols'] = [
    { wch: 5 },
    { wch: 34 },
    ...matriz.dias.map(() => ({ wch: 4 })),
    ...Array.from({ length: 11 }, () => ({ wch: 9 })),
  ]
  sheet['!rows'] = [
    { hpt: 24 },
    { hpt: 20 },
    { hpt: 20 },
    ...matriz.estudiantes.map(() => ({ hpt: 19 })),
  ]
  sheet['!freeze'] = { xSplit: 2, ySplit: 3 }
  sheet['!autofilter'] = {
    ref: XLSX.utils.encode_range({
      s: { r: 2, c: 0 },
      e: { r: Math.max(3, matriz.estudiantes.length + 2), c: totalColumns - 1 },
    }),
  }
}

function applyBestEffortStyles(sheet, matriz) {
  const range = XLSX.utils.decode_range(sheet['!ref'])
  const summaryStart = 2 + matriz.dias.length

  for (let row = range.s.r; row <= range.e.r; row += 1) {
    for (let col = range.s.c; col <= range.e.c; col += 1) {
      const address = XLSX.utils.encode_cell({ r: row, c: col })
      const cell = sheet[address]
      if (!cell) continue

      cell.s = {
        alignment: {
          horizontal: col === 1 && row >= 3 ? 'left' : 'center',
          vertical: 'center',
          wrapText: true,
        },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      }

      if (row <= 2) {
        cell.s.font = { bold: true }
        cell.s.fill = { fgColor: { rgb: row === 0 ? 'D9E2F3' : 'F2F2F2' } }
      }

      if (row >= 3) {
        const student = matriz.estudiantes[row - 3]
        if (student?.nivel_alerta === 'rojo') {
          cell.s.fill = { fgColor: { rgb: 'F4CCCC' } }
        } else if (student?.nivel_alerta === 'amarillo') {
          cell.s.fill = { fgColor: { rgb: 'FFF2CC' } }
        }

        if (col >= summaryStart) {
          cell.s.font = { bold: true }
        }
      }
    }
  }
}

function setMonthHeaderValues(sheet, matriz) {
  getMonthGroups(matriz.dias).forEach((group) => {
    const address = XLSX.utils.encode_cell({ r: 0, c: 2 + group.startIndex })
    sheet[address].v = `Mes: ${group.month}`
  })
}

function getSafeFileName(matriz) {
  const safeCourse = matriz.paralelo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return `matriz-asistencia-${safeCourse || 'paralelo'}-${matriz.anio_lectivo}.xlsx`
}

export function downloadMatrizAsistenciaExcel(matriz) {
  if (!matriz) return

  const rows = buildRows(matriz)
  const sheet = XLSX.utils.aoa_to_sheet(rows)
  setMonthHeaderValues(sheet, matriz)
  applyWorksheetMetadata(sheet, matriz)
  applyBestEffortStyles(sheet, matriz)

  const workbook = XLSX.utils.book_new()
  workbook.Props = {
    Title: `Matriz de asistencia ${matriz.paralelo}`,
    Subject: `Anio lectivo ${matriz.anio_lectivo}`,
    Author: 'PresenTech',
  }
  XLSX.utils.book_append_sheet(workbook, sheet, 'Matriz')
  XLSX.writeFile(workbook, getSafeFileName(matriz), { bookType: 'xlsx', compression: true })
}
