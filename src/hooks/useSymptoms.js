import { useEffect, useState, useCallback } from 'react'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { getNextColor } from '../lib/colors'

export function useSymptoms(userId) {
  const [symptoms, setSymptoms] = useState([])
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setSymptoms([])
      setEntries([])
      setLoading(false)
      return
    }

    let symptomsReady = false
    let entriesReady = false

    const checkReady = () => {
      if (symptomsReady && entriesReady) setLoading(false)
    }

    // Subscribe to symptoms
    const symptomsRef = collection(db, 'users', userId, 'symptoms')
    const symptomsQuery = query(symptomsRef, orderBy('createdAt', 'asc'))
    const unsubSymptoms = onSnapshot(symptomsQuery, (snap) => {
      setSymptoms(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      symptomsReady = true
      checkReady()
    })

    // Subscribe to entries
    const entriesRef = collection(db, 'users', userId, 'entries')
    const entriesQuery = query(entriesRef, orderBy('date', 'desc'))
    const unsubEntries = onSnapshot(entriesQuery, (snap) => {
      setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      entriesReady = true
      checkReady()
    })

    return () => {
      unsubSymptoms()
      unsubEntries()
    }
  }, [userId])

  // Find or create a symptom by name; returns the symptom object
  const getOrCreateSymptom = useCallback(async (name) => {
    const trimmed = name.trim()
    const existing = symptoms.find(
      s => s.name.toLowerCase() === trimmed.toLowerCase()
    )
    if (existing) return existing

    const color = getNextColor(symptoms.length)
    const ref = await addDoc(collection(db, 'users', userId, 'symptoms'), {
      name: trimmed,
      color,
      createdAt: serverTimestamp(),
    })
    return { id: ref.id, name: trimmed, color }
  }, [symptoms, userId])

  const addEntry = useCallback(async (symptomId, date, painLevel) => {
    // Store date at noon UTC to avoid timezone-boundary issues
    const d = new Date(date)
    d.setHours(12, 0, 0, 0)
    await addDoc(collection(db, 'users', userId, 'entries'), {
      symptomId,
      date: Timestamp.fromDate(d),
      painLevel: Number(painLevel),
      createdAt: serverTimestamp(),
    })
  }, [userId])

  const updateEntry = useCallback(async (entryId, changes) => {
    await updateDoc(doc(db, 'users', userId, 'entries', entryId), changes)
  }, [userId])

  const deleteEntry = useCallback(async (entryId) => {
    await deleteDoc(doc(db, 'users', userId, 'entries', entryId))
  }, [userId])

  return {
    symptoms,
    entries,
    loading,
    getOrCreateSymptom,
    addEntry,
    updateEntry,
    deleteEntry,
  }
}
