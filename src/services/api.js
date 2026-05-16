const BASE_URL = 'https://backend-api-services-291631508657.asia-southeast2.run.app';

// Helper to handle response
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/** Normalisasi ticketId dari response verify / access */
export function extractTicketId(apiResult) {
  if (!apiResult || typeof apiResult !== 'object') return null
  const d = apiResult.data !== undefined ? apiResult.data : apiResult.message?.data
  const node = d && typeof d === 'object' ? d : apiResult
  return (
    node?.ticketId
    || node?.ticket?.id
    || node?.ticket?.ticketId
    || apiResult?.ticketId
    || null
  )
}

/** Normalisasi ID reservasi dari berbagai bentuk response backend */
export function extractReservationId(res) {
  if (!res || typeof res !== 'object') return null
  const d = res.data !== undefined ? res.data : res.message?.data
  const node = d && typeof d === 'object' ? d : res
  return (
    node?.id
    || node?.reservationId
    || node?.reservation?.id
    || res?.id
    || res?.reservationId
    || null
  )
}

export const GuestService = {
  // --- Guest Access APIs ---

  buildVerifyPayload: (qrCode, extra = {}) => {
    const normalized = String(qrCode || '').trim()
    // Backend endpoint verify: hanya expect qrCode field saja
    return {
      qrCode: normalized,
      ...extra,
    }
  },

  verifyTicket: async (qrCode) => {
    const payload = GuestService.buildVerifyPayload(qrCode)
    console.log('[API] verifyTicket -> request payload:', payload);
    const response = await fetch(`${BASE_URL}/access/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Clone response to safely read text for logging without consuming the body
    const respText = await response.clone().text().catch(() => null);
    console.log('[API] verifyTicket -> status:', response.status, 'responseText:', respText);

    return handleResponse(response);
  },

  // Same verify endpoint, kept as a separate call path for compatibility with the UI flow.
  verifyTicketForce: async (qrCode) => {
    const payload = GuestService.buildVerifyPayload(qrCode)
    console.log('[API] verifyTicketForce -> request payload:', payload);
    const response = await fetch(`${BASE_URL}/access/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const respText = await response.clone().text().catch(() => null);
    console.log('[API] verifyTicketForce -> status:', response.status, 'responseText:', respText);

    return handleResponse(response);
  },

  getActiveTicket: async (guestSessionId) => {
    const response = await fetch(`${BASE_URL}/access/activeTicket?guestSessionId=${guestSessionId}`);
    return handleResponse(response);
  },

  cancelTicket: async (ticketId, guestSessionId) => {
    // Cancel endpoint expect: ticketId dan guestSessionId
    const response = await fetch(`${BASE_URL}/access/cancelTicket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ticketId, guestSessionId }),
    });
    return handleResponse(response);
  },

  // --- Guest Reservation APIs ---

  createReservation: async (data) => {
    // data: { slotId, ticketId, name, plateNumber }
    const response = await fetch(`${BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  arriveInSlot: async (reservationId) => {
    const response = await fetch(`${BASE_URL}/reservations/${reservationId}/arrive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return handleResponse(response);
  },

  completeReservation: async (reservationId) => {
    const response = await fetch(`${BASE_URL}/reservations/${reservationId}/complete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return handleResponse(response);
  },

  swapSlot: async (reservationId, newSlotId) => {
    const response = await fetch(`${BASE_URL}/reservations/${reservationId}/swap`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newSlotId }),
    });
    return handleResponse(response);
  },

  cancelReservation: async (reservationId) => {
    const response = await fetch(`${BASE_URL}/reservations/${reservationId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return handleResponse(response);
  },

  // --- Public APIs (Areas & Slots) ---

  getAllAreas: async () => {
    const response = await fetch(`${BASE_URL}/areas`);
    return handleResponse(response);
  },

  getAreaById: async (areaId) => {
    const response = await fetch(`${BASE_URL}/areas/${areaId}`);
    return handleResponse(response);
  },

  getAllSlotsInArea: async (areaId) => {
    const response = await fetch(`${BASE_URL}/areas/${areaId}/slots`);
    return handleResponse(response);
  },

  getSlotById: async (slotId) => {
    const response = await fetch(`${BASE_URL}/areas/slots/${slotId}`);
    return handleResponse(response);
  },

  // --- System ---

  getDownloadAppLink: () => {
    return `${BASE_URL}/system/app/download`;
  }
};
