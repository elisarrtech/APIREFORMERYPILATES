"""
Report Service - Servicio de Generación de Reportes
Genera reportes en PDF, HTML y CSV

@version 2.0.0
@author @elisarrtech
@date 2025-10-28
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from io import BytesIO
import pandas as pd
from datetime import datetime
from jinja2 import Template


class ReportService:
    """
    Servicio profesional de generación de reportes
    """
    
    @staticmethod
    def generate_pdf_report(stats, report_type='estadisticas_avanzadas'):
        """
        Genera reporte PDF con diseño profesional
        
        Args:
            stats (dict): Datos de estadísticas
            report_type (str): Tipo de reporte
            
        Returns:
            BytesIO: Buffer con el PDF generado
        """
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, title=f"Reporte REFORMERY - {report_type}")
        
        # Estilos
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#7C3AED'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#4B5563'),
            spaceBefore=20,
            spaceAfter=10,
            fontName='Helvetica-Bold'
        )
        
        # Contenido
        content = []
        
        # Título
        content.append(Paragraph("REFORMERY - Pilates Studio", title_style))
        content.append(Paragraph("Reporte de Estadísticas Avanzadas", styles['Heading2']))
        content.append(Paragraph(f"Fecha: {datetime.now().strftime('%d/%m/%Y %H:%M')}", styles['Normal']))
        content.append(Spacer(1, 0.5*inch))
        
        # Estadísticas de Alumnos
        if 'students_status' in stats:
            content.append(Paragraph("Estado de Alumnos", heading_style))
            student_data = [
                ['Métrica', 'Cantidad'],
                ['Alumnos Activos', str(stats['students_status']['active'])],
                ['Alumnos Inactivos', str(stats['students_status']['inactive'])],
                ['Total Alumnos', str(stats['students_status']['total'])]
            ]
            
            student_table = Table(student_data, colWidths=[3*inch, 2*inch])
            student_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#7C3AED')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey])
            ]))
            content.append(student_table)
            content.append(Spacer(1, 0.3*inch))
        
        # Clases por Instructor
        if 'classes_by_instructor' in stats and stats['classes_by_instructor']:
            content.append(Paragraph("Clases por Instructor", heading_style))
            instructor_data = [['Instructor', 'Total Clases']]
            for item in stats['classes_by_instructor']:
                instructor_data.append([item['instructor_name'], str(item['total_classes'])])
            
            instructor_table = Table(instructor_data, colWidths=[3*inch, 2*inch])
            instructor_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3B82F6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey])
            ]))
            content.append(instructor_table)
            content.append(Spacer(1, 0.3*inch))
        
        # Asistencias por Clase
        if 'reservations_by_class' in stats and stats['reservations_by_class']:
            content.append(Paragraph("Asistencias por Clase", heading_style))
            class_data = [['Clase', 'Reservas', 'Asistencias', '% Asistencia']]
            for item in stats['reservations_by_class']:
                class_data.append([
                    item['class_name'],
                    str(item['total_reservations']),
                    str(item['total_attended']),
                    f"{item['attendance_percentage']}%"
                ])
            
            class_table = Table(class_data, colWidths=[2.5*inch, 1*inch, 1*inch, 1.5*inch])
            class_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8B5CF6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey])
            ]))
            content.append(class_table)
            content.append(Spacer(1, 0.3*inch))
        
        # Popularidad de Paquetes
        if 'package_purchases' in stats and stats['package_purchases']:
            content.append(Paragraph("Popularidad de Paquetes", heading_style))
            package_data = [['Paquete', 'Total Compras']]
            for item in stats['package_purchases']:
                package_data.append([item['package_name'], str(item['total_purchases'])])
            
            package_table = Table(package_data, colWidths=[3*inch, 2*inch])
            package_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F59E0B')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey])
            ]))
            content.append(package_table)
        
        # Footer
        content.append(Spacer(1, 0.5*inch))
        content.append(Paragraph("Generado por REFORMERY - Sistema de Gestión de Pilates", 
                                styles['Normal']))
        content.append(Paragraph(f"© {datetime.now().year} REFORMERY. Todos los derechos reservados.", 
                                styles['Normal']))
        
        # Construir PDF
        doc.build(content)
        buffer.seek(0)
        return buffer
    
    @staticmethod
    def generate_csv_report(stats):
        """
        Genera reporte CSV para Excel/Google Sheets
        
        Args:
            stats (dict): Datos de estadísticas
            
        Returns:
            str: Contenido CSV
        """
        csv_content = []
        csv_content.append("REFORMERY - Reporte de Estadísticas Avanzadas")
        csv_content.append(f"Fecha de generación: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
        csv_content.append("")
        
        # Estado de Alumnos
        if 'students_status' in stats:
            csv_content.append("ESTADO DE ALUMNOS")
            csv_content.append("Métrica,Cantidad")
            csv_content.append(f"Alumnos Activos,{stats['students_status']['active']}")
            csv_content.append(f"Alumnos Inactivos,{stats['students_status']['inactive']}")
            csv_content.append(f"Total Alumnos,{stats['students_status']['total']}")
            csv_content.append("")
        
        # Clases por Instructor
        if 'classes_by_instructor' in stats:
            csv_content.append("CLASES POR INSTRUCTOR")
            csv_content.append("Instructor,Total Clases")
            for item in stats['classes_by_instructor']:
                csv_content.append(f"{item['instructor_name']},{item['total_classes']}")
            csv_content.append("")
        
        # Asistencias por Clase
        if 'reservations_by_class' in stats:
            csv_content.append("ASISTENCIAS POR CLASE")
            csv_content.append("Clase,Total Reservas,Total Asistencias,% Asistencia")
            for item in stats['reservations_by_class']:
                csv_content.append(
                    f"{item['class_name']},{item['total_reservations']},"
                    f"{item['total_attended']},{item['attendance_percentage']}%"
                )
            csv_content.append("")
        
        # Popularidad de Paquetes
        if 'package_purchases' in stats:
            csv_content.append("POPULARIDAD DE PAQUETES")
            csv_content.append("Paquete,Total Compras")
            for item in stats['package_purchases']:
                csv_content.append(f"{item['package_name']},{item['total_purchases']}")
        
        return "\n".join(csv_content)
    
    @staticmethod
    def generate_html_report(stats):
        """
        Genera reporte HTML con diseño profesional
        
        Args:
            stats (dict): Datos de estadísticas
            
        Returns:
            str: HTML generado
        """
        html_template = """
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>REFORMERY - Reporte de Estadísticas</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 40px;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }
                .header {
                    text-align: center;
                    border-bottom: 3px solid #7C3AED;
                    padding-bottom: 30px;
                    margin-bottom: 40px;
                }
                .header h1 {
                    color: #7C3AED;
                    font-size: 3em;
                    margin-bottom: 10px;
                }
                .header h2 {
                    color: #4B5563;
                    font-size: 1.5em;
                    margin-bottom: 10px;
                }
                .date {
                    color: #6B7280;
                    font-size: 1em;
                }
                .section {
                    margin-bottom: 40px;
                }
                .section-title {
                    color: #1F2937;
                    font-size: 2em;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #E5E7EB;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .stat-card {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    border-radius: 15px;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    transform: translateY(0);
                    transition: transform 0.3s;
                }
                .stat-card:hover {
                    transform: translateY(-5px);
                }
                .stat-card h3 {
                    font-size: 1.2em;
                    margin-bottom: 15px;
                    opacity: 0.9;
                }
                .stat-card .value {
                    font-size: 3em;
                    font-weight: bold;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                th {
                    background: #7C3AED;
                    color: white;
                    padding: 15px;
                    text-align: left;
                    font-weight: bold;
                }
                td {
                    padding: 12px 15px;
                    border-bottom: 1px solid #E5E7EB;
                }
                tr:hover {
                    background: #F9FAFB;
                }
                .progress-bar {
                    width: 100%;
                    height: 25px;
                    background: #E5E7EB;
                    border-radius: 12px;
                    overflow: hidden;
                    margin-top: 10px;
                }
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #10B981, #059669);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 0.9em;
                }
                .footer {
                    text-align: center;
                    margin-top: 60px;
                    padding-top: 30px;
                    border-top: 2px solid #E5E7EB;
                    color: #6B7280;
                }
                @media print {
                    body { background: white; padding: 0; }
                    .container { box-shadow: none; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏋️ REFORMERY</h1>
                    <h2>Pilates Studio - Reporte de Estadísticas Avanzadas</h2>
                    <p class="date">Fecha de generación: {{ fecha }}</p>
                </div>
                
                {% if stats.students_status %}
                <div class="section">
                    <h2 class="section-title">📊 Estado de Alumnos</h2>
                    <div class="stats-grid">
                        <div class="stat-card" style="background: linear-gradient(135deg, #10B981, #059669);">
                            <h3>Alumnos Activos</h3>
                            <div class="value">{{ stats.students_status.active }}</div>
                        </div>
                        <div class="stat-card" style="background: linear-gradient(135deg, #EF4444, #DC2626);">
                            <h3>Alumnos Inactivos</h3>
                            <div class="value">{{ stats.students_status.inactive }}</div>
                        </div>
                        <div class="stat-card" style="background: linear-gradient(135deg, #3B82F6, #2563EB);">
                            <h3>Total Alumnos</h3>
                            <div class="value">{{ stats.students_status.total }}</div>
                        </div>
                    </div>
                </div>
                {% endif %}
                
                {% if stats.classes_by_instructor %}
                <div class="section">
                    <h2 class="section-title">🏋️ Clases por Instructor</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Instructor</th>
                                <th>Total Clases</th>
                            </tr>
                        </thead>
                        <tbody>
                            {% for item in stats.classes_by_instructor %}
                            <tr>
                                <td>{{ item.instructor_name }}</td>
                                <td><strong>{{ item.total_classes }}</strong> clases</td>
                            </tr>
                            {% endfor %}
                        </tbody>
                    </table>
                </div>
                {% endif %}
                
                {% if stats.reservations_by_class %}
                <div class="section">
                    <h2 class="section-title">📈 Asistencias por Clase</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Clase</th>
                                <th>Reservas</th>
                                <th>Asistencias</th>
                                <th>% Asistencia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {% for item in stats.reservations_by_class %}
                            <tr>
                                <td><strong>{{ item.class_name }}</strong></td>
                                <td>{{ item.total_reservations }}</td>
                                <td>{{ item.total_attended }}</td>
                                <td>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: {{ item.attendance_percentage }}%;">
                                            {{ item.attendance_percentage }}%
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            {% endfor %}
                        </tbody>
                    </table>
                </div>
                {% endif %}
                
                {% if stats.package_purchases %}
                <div class="section">
                    <h2 class="section-title">📦 Popularidad de Paquetes</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Paquete</th>
                                <th>Total Compras</th>
                            </tr>
                        </thead>
                        <tbody>
                            {% for item in stats.package_purchases %}
                            <tr>
                                <td><strong>{{ item.package_name }}</strong></td>
                                <td>{{ item.total_purchases }} compras</td>
                            </tr>
                            {% endfor %}
                        </tbody>
                    </table>
                </div>
                {% endif %}
                
                <div class="footer">
                    <p><strong>Generado por REFORMERY - Sistema de Gestión de Pilates</strong></p>
                    <p>© {{ year }} REFORMERY. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        template = Template(html_template)
        html_content = template.render(
            stats=stats,
            fecha=datetime.now().strftime('%d/%m/%Y %H:%M'),
            year=datetime.now().year
        )
        
        return html_content