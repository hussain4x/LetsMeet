import fetch from 'isomorphic-fetch';
import nprogress from 'nprogress';
import jsonpatch from 'fast-json-patch';

import { checkStatus, parseJSON } from './fetch.util';

export async function loadEvents(showPastEvents) {
  let urlToFetch = '/api/events/getByUser';
  nprogress.configure({ showSpinner: false });
  nprogress.start();
  if (!showPastEvents) {
    const date = new Date();
    urlToFetch = `/api/events/getByUser/${date.toISOString()}`;
  }
  const response = await fetch(urlToFetch, { credentials: 'same-origin' });
  let events;
  try {
    checkStatus(response);
    events = await parseJSON(response);
    return events;
  } catch (err) {
    console.log('loadEvents, at events.js', err);
    return err;
  } finally {
    nprogress.done();
  }
}

export async function loadEvent(id) {
  nprogress.configure({ showSpinner: false });
  nprogress.start();
  const response = await fetch(`/api/events/${id}`, {
    credentials: 'same-origin',
  });
  try {
    checkStatus(response);
    const event = await parseJSON(response);
    return event;
  } catch (err) {
    console.log('err at loadEvent EventDetail', err);
    return null;
  } finally {
    nprogress.done();
  }
}

export async function addEvent(event) {
  nprogress.configure({ showSpinner: false });
  nprogress.start();
  const response = await fetch('/api/events', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: event,
    credentials: 'same-origin',
  });

  let newEvent;
  try {
    checkStatus(response);
    newEvent = await parseJSON(response);
    return newEvent;
  } catch (err) {
    console.log('err at POST NewEvent', err);
    return err;
  } finally {
    nprogress.done();
  }
}

export async function deleteEvent(id) {
  nprogress.configure({ showSpinner: false });
  nprogress.start();
  const response =  await fetch(
  `/api/events/${id}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      credentials: 'same-origin',
    },
  );
  try {
    checkStatus(response);
    return true;
  } catch (err) {
    console.log('deleteEvent', err);
    return false;
  } finally {
    nprogress.done();
  }
}

export async function deleteGuest(guestToDelete) {
  nprogress.configure({ showSpinner: false });
  const response = await fetch(
    `/api/events/participant/${guestToDelete}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      credentials: 'same-origin',
    },
  );
  try {
    checkStatus(response);
    const editEvent = await parseJSON(response);
    return editEvent;
  } catch (err) {
    console.log('error at deleteEvent Modal', err);
    return false;
  } finally {
    nprogress.done();
  }
}

export async function editEvent(patches, eventId) {
  nprogress.configure({ showSpinner: false });
  nprogress.start();
  const response = await fetch(`/api/events/${eventId}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    method: 'PATCH',
    body: JSON.stringify(patches),
  });

  try {
    checkStatus(response);
    const EditEvent = await parseJSON(response);
    return EditEvent;
  } catch (err) {
    console.log('events editEvent', err);
    return false;
  } finally {
    nprogress.done();
  }
}

export async function loadOwnerData(_id) {
  const response = await fetch(`/api/user/${_id}`, { credentials: 'same-origin' });
  try {
    checkStatus(response);
    return await parseJSON(response);
  } catch (err) {
    console.log('loadOwnerData', err);
    return null;
  }
}
/**
 * @param {*} guestId user id to edit as participant
 * @param {*} event to add the user as participant
 * @param {*} status to set at participant
 */
export async function EditStatusParticipantEvent(guestId, event, status) {
  const observe = jsonpatch.observe(event);
  event.participants.map((participant) => {
    if (participant.userId._id.toString() === guestId) {
      participant.status = status;
    }
    return participant;
  });
  const patch = jsonpatch.generate(observe);
  return editEvent(patch, event._id);
}

export async function AddEventParticipant(guestId, event) {
  const observe = jsonpatch.observe(event);
  event.participants.push({ userId: guestId, status: 1 });
  const patch = jsonpatch.generate(observe);
  const response = await editEvent(patch, event._id);
  return response;
}

export async function loadEventFull(id) {
  nprogress.configure({ showSpinner: false });
  nprogress.start();
  const response = await fetch(`/api/events/getFull/${id}`, {
    credentials: 'same-origin',
  });
  try {
    checkStatus(response);
    const event = await parseJSON(response);
    return event;
  } catch (err) {
    console.log('err at loadEventFull', err);
    return null;
  } finally {
    nprogress.done();
  }
}
