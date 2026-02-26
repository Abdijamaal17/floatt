import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { AIReport, DomainRow, ScanRow } from '@/types'

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#dc2626',
  high:     '#ea580c',
  medium:   '#d97706',
  low:      '#2563eb',
  info:     '#6b7280',
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 48,
    backgroundColor: '#ffffff',
    color: '#18181b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingBottom: 16,
    borderBottom: '1px solid #e4e4e7',
  },
  brandName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#4f46e5',
  },
  brandTag: {
    fontSize: 8,
    color: '#71717a',
    marginTop: 2,
  },
  metaRight: {
    textAlign: 'right',
  },
  metaLabel: {
    fontSize: 8,
    color: '#71717a',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    color: '#111827',
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f4f4f5',
    borderRadius: 8,
    marginBottom: 16,
    gap: 16,
  },
  scoreNumber: {
    fontSize: 36,
    fontFamily: 'Helvetica-Bold',
  },
  scoreLabel: {
    fontSize: 9,
    color: '#71717a',
    marginTop: 2,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#374151',
    flex: 1,
  },
  findingCard: {
    marginBottom: 12,
    padding: 12,
    border: '1px solid #e4e4e7',
    borderRadius: 6,
  },
  findingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  severityBadge: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    padding: '2 6',
    borderRadius: 4,
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  findingTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    flex: 1,
  },
  findingBody: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#4b5563',
    marginBottom: 4,
  },
  findingFix: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#1e40af',
    fontFamily: 'Helvetica-Oblique',
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1px solid #e4e4e7',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
  },
})

function scoreColor(score: number): string {
  if (score >= 80) return '#16a34a'
  if (score >= 60) return '#d97706'
  return '#dc2626'
}

interface ReportProps {
  domain: DomainRow
  scan: ScanRow
  report: AIReport
}

export function FloattPDFReport({ domain, scan, report }: ReportProps) {
  const scanDate = scan.completed_at
    ? new Date(scan.completed_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : 'Unknown'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>Floatt</Text>
            <Text style={styles.brandTag}>AI-Powered Security Monitoring</Text>
          </View>
          <View style={styles.metaRight}>
            <Text style={styles.metaLabel}>SECURITY REPORT</Text>
            <Text style={styles.metaValue}>{domain.domain}</Text>
            <Text style={styles.metaLabel}>Scan date: {scanDate}</Text>
          </View>
        </View>

        {/* Score + Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Overview</Text>
          <View style={styles.scoreBox}>
            <View>
              <Text style={[styles.scoreNumber, { color: scoreColor(report.overall_score) }]}>
                {report.overall_score}
              </Text>
              <Text style={styles.scoreLabel}>Security Score</Text>
            </View>
            <Text style={styles.summary}>{report.summary}</Text>
          </View>
        </View>

        {/* Findings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Findings ({report.findings.length})
          </Text>
          {report.findings.map((finding) => (
            <View key={finding.id} style={styles.findingCard}>
              <View style={styles.findingHeader}>
                <View
                  style={[
                    styles.severityBadge,
                    { backgroundColor: SEVERITY_COLORS[finding.severity] ?? '#6b7280' },
                  ]}
                >
                  <Text>{finding.severity}</Text>
                </View>
                <Text style={styles.findingTitle}>{finding.title}</Text>
              </View>
              <Text style={styles.findingBody}>{finding.explanation}</Text>
              <Text style={styles.findingFix}>Fix: {finding.recommendation}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Generated by Floatt — floatt.io — Authorized scanning only
          </Text>
          <Text style={styles.footerText}>
            {new Date().toLocaleDateString()}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
